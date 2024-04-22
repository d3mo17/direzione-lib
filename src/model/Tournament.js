/**
 * A library of components that can be used to manage a martial arts tournament
 *
 * Copyright (C) 2023 Daniel Moritz
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, according to version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 * @param   {Object} root
 * @param   {Function} factory
 * @license GPL-3.0
 *
 * @returns {Object}
 */
/** @namespace "Direzione" */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'direzione-lib/model/Fight',
            'direzione-lib/model/FightHistory',
            'direzione-lib/config/FightSettings',
            'direzione-lib/model/Opponent',
            'direzione-lib/model/OpponentGroup',
            'direzione-lib/model/Person',
            'direzione-lib/view/Scoreboard',
            'direzione-lib/service/FightEmitter',
            'direzione-lib/service/FightReceiver',
            'direzione-lib/service/FightEmitterLocal',
            'direzione-lib/service/FightReceiverLocal',
            'direzione-lib/service/LocalBroker',
            'direzione-lib/model/Playlist',
            'direzione-lib/view/Repertoire',
            'direzione-lib/util/Utils',
            'direzione-lib/util/RingIterator',
            'direzione-lib/util/RoundRobinTournamentIterator'
        ],factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(
            require('./Fight'),
            require('./FightHistory'),
            require('../config/FightSettings'),
            require('./Opponent'),
            require('./OpponentGroup'),
            require('./Person'),
            require('../view/Scoreboard'),
            require('../service/FightEmitter'),
            require('../service/FightReceiver'),
            require('../service/FightEmitterLocal'),
            require('../service/FightReceiverLocal'),
            require('../service/LocalBroker'),
            require('./Playlist'),
            require('../view/Repertoire'),
            require('../util/Utils'),
            require('../util/RingIterator'),
            require('../util/RoundRobinTournamentIterator')
        )
    } else {
        root.Direzione = factory(
            root.Direzione.Fight,
            root.Direzione.FightHistory,
            root.Direzione.FightSettings,
            root.Direzione.Opponent,
            root.Direzione.OpponentGroup,
            root.Direzione.Person,
            root.Direzione.Scoreboard,
            root.Direzione.FightEmitter,
            root.Direzione.FightReceiver,
            root.Direzione.FightEmitterLocal,
            root.Direzione.FightReceiverLocal,
            root.Direzione.LocalBroker,
            root.Direzione.Playlist,
            root.Direzione.Repertoire,
            root.Direzione.Utils,
            root.Direzione.RingIterator,
            root.Direzione.RoundRobinTournamentIterator
        )
        root.Direzione.Tournament = { create: root.Direzione.create }
    }
}(this, function (
    Fight,
    FightHistory,
    FightSettings,
    Opponent,
    OpponentGroup,
    Person,
    Scoreboard,
    FightEmitter,
    FightReceiver,
    FightEmitterLocal,
    FightReceiverLocal,
    LocalBroker,
    Playlist,
    Repertoire,
    Utils,
    RingIterator,
    RoundRobinTournamentIterator
) {

    /**
     * @class
     * @hideconstructor
     * @global
     * @private
     *
     * @param {FightSettings} fightSettings
     */
    function Tournament(fightSettings) {
        this[' groups']    = []
        this[' playlist']  = Playlist.create()
        this[' fightSettings'] = fightSettings

        this[' listener'] = { repose: [] }
    }
    Tournament.prototype = {
        addFight: _addFight,
        addGroup: function (group) {
            this[' groups'].push(group)
            return this
        },
        on: _registerEventListener,
        build: _build,
        setGroups: function (groups) {
            this[' groups'] = groups
            return this
        },
        getName: function () { return this[' name'] },
        setName: function (name) {
            this[' name'] = name
            return this
        },
        getPlaylist: function () { return this[' playlist'] },
        toStruct: _toStruct
    }

    function _build(iterator) {
        var i = 0, processed = []
        var iterators, persList, opponents
        this[' iterators'] = []

        if (! ('create' in iterator)) {
            new TypeError('Not an iterator!')
        }

        this[' groups'].forEach(function (group) {
            this[' iterators'].push(iterator.create(group.getPersons()))
            processed.push(false)
        }, this);

        iterators = RingIterator.create(this[' iterators'])

        while (persList = iterators.next()) {
            for (;;) {
                opponents = persList.next()
                if (opponents === null) {
                    processed[i % this[' iterators'].length] = true
                    break
                }
                if (opponents.length === 0) break
                _addFight.call(this, opponents[0], opponents[1])
            }
            if (processed.every(function (entry) { return entry })) return
            i++
        }
    }

    function _toStruct () {
        return {
            name: this[' name'],
            playlist: this[' playlist'].toStruct(),
            groups: this[' groups'].map(function (group) {
                return group.toStruct()
            })
        }
    }


    function _playSound() {
        var audio = new Audio(this[' fightSettings'].getTimeUpSoundFile())

        audio.currentTime = 0
        audio.oncanplay = function () {
            audio.play()
        }
    }

    function _addFight(whiteOpponentPerson, redOpponentPerson, fightSettings) {
        var fight = Fight.create(
            fightSettings || this[' fightSettings'],
            Opponent.create(whiteOpponentPerson),
            Opponent.create(redOpponentPerson)
        )

        this[' playlist'].insert(
            fight
                .on('timeUp', function(fight) {
                    _playSound.call(this)
                    _dispatch.call(this, 'repose', ['timeUp', fight])
                }.bind(this, fight))
                .on('startPauseResume', function (fight) {
                    ! fight.isRunning() && _dispatch.call(this, 'repose', ['pause', fight])
                }.bind(this, fight))
                .on('stop', function(fight) {
                    _dispatch.call(this, 'repose', ['stop', fight])
                }.bind(this, fight))
        )

        return fight
    }

    /**
     * Registers an event-listener to this object
     *
     * @method  Fight#on
     * @param   {String} type
     * @param   {Function} callback
     * @private
     */
    function _registerEventListener(type, callback) {
        var eventTypes = Object.keys(this[' listener'])
        if (eventTypes.indexOf(type) === -1) {
            throw new RangeError(
                'Only following values are allowed for event type: ' + eventTypes.join(', ') + '!'
            )
        }

        this[' listener'][type].push(callback)

        return this
    }

    /**
     * Notifies all listeners of passed event-type.
     *
     * @private
     * @param {String} type
     * @param {*} data
     */
    function _dispatch(type, data) {
        this[' listener'][type].forEach(function (listener) {
            listener.call(this, data)
        }, this)
    }

    // Module-API
    return {
        Fight:                        Fight,
        FightHistory:                 FightHistory,
        FightSettings:                FightSettings,
        Opponent:                     Opponent,
        OpponentGroup:                OpponentGroup,
        Person:                       Person,
        Scoreboard:                   Scoreboard,
        FightEmitter:                 FightEmitter,
        FightReceiver:                FightReceiver,
        FightEmitterLocal:            FightEmitterLocal,
        FightReceiverLocal:           FightReceiverLocal,
        LocalBroker:                  LocalBroker,
        Playlist:                     Playlist,
        Repertoire:                   Repertoire,
        Utils:                        Utils,
        RingIterator:                 RingIterator,
        RoundRobinTournamentIterator: RoundRobinTournamentIterator,
        /**
         * Creates an object to organize a tournament.
         *
         * @static
         * @method   create
         * @memberof "Direzione.Tournament"
         *
         * @param {FightSettings} fightSettings
         *
         * @returns  {Tournament}
         */
        create: function (fightSettings) {
            return new Tournament(fightSettings)
        }
    }
}))
