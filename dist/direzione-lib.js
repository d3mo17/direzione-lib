/**
 * Direzione Library v0.18
 */
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
 *
 * @license GPL-3.0
 *
 * @returns {Object}
 */
/** @namespace "Direzione.FightHistory" */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('direzione-lib/model/FightHistory',factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory()
    } else {
        root.Direzione = root.Direzione || {}
        root.Direzione.FightHistory = factory()
    }
}(this, function () {

    /**
     * @class
     * @hideconstructor
     * @global
     * @private
     *
     * @param {Fight} fight
     */
    function FightHistory(fight) {
        this[' fight'] = fight
        this[' log']   = []

        this.registerEventListeners()
    }

    FightHistory.prototype = {
        getFight: function () { return this[' fight'] },
        getLog: function () { return JSON.parse(JSON.stringify(this[' log'])) }
    }

    /**
     * Inserts a log entry to the history
     *
     * @public
     * @param {String} type
     * @param {*} data
     */
    FightHistory.prototype.insert = function (type, data) {
        var countdown, signal = type

        // do not log internal events
        if (type === 'removeCountUp') return

        while (type === 'startPauseResume') {
            if (this[' log'].length === 0) { signal = 'start'; break }

            countdown = this[' fight'].getCountdown()
            signal = countdown && countdown.isPaused() ? 'pause' : 'resume'
            break
        }

        this[' log'].push([Date.now()].concat(signal, data))
    }

    /**
     * Registers necessary listeners to the opponents in a fight, being able to
     * insert log entries
     *
     * @public
     */
    FightHistory.prototype.registerEventListeners = function () {
        this[' fight'].getWhiteOpponent()
            .on('add', _logger.bind(this, 'white', 'add'))
            .on('remove', _logger.bind(this, 'white', 'remove'))
        this[' fight'].getRedOpponent()
            .on('add', _logger.bind(this, 'red', 'add'))
            .on('remove', _logger.bind(this, 'red', 'remove'))
    }

    function _logger(side, op, what) {
        this[' log'].push([Date.now(), side, op, what])
    }

    // Module-API
    return {
        /**
         * Creates an object to manage a the history of a fight.
         *
         * @static
         * @method   create
         * @memberof "Direzione.FightHistory"
         * @param    {Fight} fight
         * @returns  {FightHistory}
         */
        create: function (fight) {
            return new FightHistory(fight)
        }
    }
}))
;
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
 *
 * @license GPL-3.0
 *
 * @returns {Object}
 */
/** @namespace "Direzione.Fight" */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('direzione-lib/model/Fight',['durata/dist/durata.min', 'direzione-lib/model/FightHistory'], factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('durata'), require('./FightHistory'))
    } else {
        root.Direzione = root.Direzione || {}
        root.Direzione.Fight = factory(root.Durata, root.Direzione.FightHistory)
    }
}(this, function (Durata, FightHistory) {

    /**
     * @class
     * @hideconstructor
     * @global
     * @private
     *
     * @param   {FightSettings} settings
     * @param   {Opponent} whiteOpponent
     * @param   {Opponent} redOpponent
     * @param   {Boolean} noHistory
     *
     * @borrows <anonymous>~_removeAllEventListeners as clearListeners
     * @borrows <anonymous>~_getTimeLeft as getTimeLeft
     * @borrows <anonymous>~_isRunning as isRunning
     * @borrows <anonymous>~_registerEventListener as on
     * @borrows <anonymous>~_reset as reset
     * @borrows <anonymous>~_startPauseResume as startPauseResume
     * @borrows <anonymous>~_osaeKomi as osaeKomi
     * @borrows <anonymous>~_stop as stop
     * @borrows <anonymous>~_toketa as toketa
     */
    function Fight(settings, whiteOpponent, redOpponent, noHistory) {
        this[' settings']      = settings
        this[' whiteOpponent'] = whiteOpponent
        this[' redOpponent']   = redOpponent

        this[' history']  = (typeof noHistory !== 'undefined') && !!noHistory
            ? false : FightHistory.create(this)

        this[' stopped']  = false
        this[' listener'] = { reset: [], startPauseResume: [], osaeKomi: [], stop: [], toketa: [], removeCountUp: [], timeUp: [] }
    }


    /**
     * Duration of a fight (in milliseconds)
     * @readonly
     * @const {number}
     */
    Fight.DURATION = 3 * 60 * 1000 // ms

    /**
     * Maximum count up (in milliseconds)
     * @readonly
     * @const {number}
     */
    Fight.COUNTUP = 10 * 1000 // ms

    /**
     * Lock-out of persons after a fight (in milliseconds)
     * @readonly
     * @const {number}
     */
    Fight.LOCK_OUT = 10 * 60 * 1000 // ms

    Fight.SIDE_WHITE  = 'white'
    Fight.SIDE_RED    = 'red'
    Fight.SIDE_CENTER = 'center'

    Fight.prototype = {
        clearListeners:   _removeAllEventListeners,
        getHistory:       function () { return this[' history'] },
        getCountdown:     function () { return _countdownExists.call(this) && this[' countdown'] },
        getCountUp:       function () { return _countUpExists.call(this) && this[' countup'] },
        getWhiteOpponent: function () { return this[' whiteOpponent'] },
        getRedOpponent:   function () { return this[' redOpponent'] },
        getTimeLeft:      _getTimeLeft,
        isRunning:        _isRunning,
        isStopped:        function () { return this[' stopped'] },
        invertSide:       _invertSide,
        on:               _registerEventListener,
        removeCountUp:    _removeCountUp,
        reset:            _reset,
        startPauseResume: _startPauseResume,
        osaeKomi:         _osaeKomi,
        stop:             _stop,
        toketa:           _toketa
    }

    /**
     * Returns the object that holds the fight history
     *
     * @method  Fight#getHistory
     * @public
     * @returns {FightHistory}
     */

    /**
     * Returns the object to process countdown
     *
     * @method  Fight#getCountDown
     * @public
     * @returns {DurataSingleValue|false}
     */

    /**
     * Returns the object to process count up
     *
     * @method  Fight#getCountUp
     * @public
     * @returns {DurataSingleValue|false}
     */

    /**
     * Returns the object to manage the judika on white side
     *
     * @method  Fight#getWhiteOpponent
     * @public
     * @returns {Opponent}
     */

    /**
     * Returns the object to manage the judika on red side
     *
     * @method  Fight#getRedOpponent
     * @public
     * @returns {Opponent}
     */

    /**
     * Returns whether the fight is going on
     *
     * @method  Fight#isStopped
     * @public
     * @returns {Boolean}
     */

    /**
     * Inverts passed side; Makes left from right and right from left - keeps center ...
     *
     * @method  Fight#invertSide
     * @public
     * @returns {String}
     */

    /**
     * Returns whether the fight is still going on
     *
     * @method  Fight#isRunning
     * @public
     * @returns {Boolean}
     */
    function _isRunning() {
        return !this[' stopped'] &&
            _countdownExists.call(this) &&
            !this[' countdown'].isPaused() &&
            !this[' countdown'].isComplete()
    }

    /**
     * Returns whether the object to process the countdown is available
     *
     * @private
     * @returns {Boolean}
     */
    function _countdownExists() {
        return typeof this[' countdown'] !== 'undefined'
    }

    /**
     * Returns whether the object to count up is available
     *
     * @private
     * @returns {Boolean}
     */
    function _countUpExists() {
        return typeof this[' countup'] !== 'undefined'
    }

    /**
     * Returns remainig milliseconds until the fight ends
     *
     * @method  Fight#getTimeLeft
     * @private
     * @returns {Integer}
     */
    function _getTimeLeft() {
        return _countdownExists.call(this) ? this[' countdown'].get() : this[' settings'].getDuration()
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
     * Removes all listeners of this object
     *
     * @method Fight#clearListeners
     * @param  {Boolean} externalOnly Default `true`
     * @public
     */
    function _removeAllEventListeners(externalOnly) {
        externalOnly = typeof externalOnly === 'undefined' ? true : externalOnly

        var eventTypes = Object.keys(this[' listener'])
        eventTypes.forEach(function (key) {
            delete this[' listener'][key]
            this[' listener'][key] = []
        }, this)

        this.getRedOpponent().clearListeners()
        this.getWhiteOpponent().clearListeners()

        externalOnly && !!this.getHistory() && this.getHistory().registerEventListeners()
    }

    /**
     * Removes the count up procedure
     *
     * @private
     * @fires   Fight#removeCountUp
     */
    function _removeCountUp() {
        if (_countUpExists.call(this)) {
            this[' countup'].stop('reset')
            delete this[' countup']
            _dispatch.call(this, 'removeCountUp')
        }
    }

    /**
     * Resets the fight (Time and score to initial values)
     *
     * @method  Fight#reset
     * @fires   Fight#reset
     * @public
     * @param   {Integer} forceMS Optional - If this is passed to the function, the countdown will be
     *                            forced to this millisecond value
     */
    function _reset(forceMS) {
        this[' stopped'] = false
        _removeCountUp.call(this)
        _countdownExists.call(this) && this[' countdown'].stop('interrupt')
        _newCountDown.call(this, forceMS)
        this[' countdown'].pause('reset')
        this[' whiteOpponent'].reset()
        this[' redOpponent'].reset()

        // do not register event listeners, if milliseconds were passed, because this means the
        // fight is controlled from the outside were the logic happens
        if (typeof forceMS !== 'undefined') return

        _dispatch.call(this, 'reset', _countdownExists.call(this) ? this[' countdown'].get() : undefined )
    }

    /**
     * Toggles pause and resume for the countdown
     *
     * @private
     * @method  Fight#togglePauseResume
     */
    function _togglePauseResume() {
        this.isStopped()
            || this[' countdown'].isPaused() && this[' countdown'].resume('toggle')
            || this[' countdown'].pause('toggle')
    }

    /**
     * Creates a new object for the countdown
     *
     * @private
     * @param   {Integer} forceMS Optional milliseconds the start of countdown should be set to
     */
    function _newCountDown(forceMS) {
        var local_ms = typeof forceMS !== 'undefined' ? forceMS : this[' settings'].getDuration()
        _countdownExists.call(this) && this[' countdown'].stop('dirty')
        this[' countdown'] = Durata.create(local_ms, 0, local_ms).on('resume', _removeCountUp.bind(this))

        // do not register event listeners, if milliseconds were passed, because this means the
        // fight is controlled from the outside were the logic happens
        if (typeof forceMS !== 'undefined') return

        this[' countdown']
            .on('complete', function () {
                _stop.call(this)
                _dispatch.call(this, 'timeUp')
            })
            .on('pause', _toketa.bind(this, undefined))
    }

    /**
     * Starts, pauses or resumes the fight
     *
     * @method  Fight#startPauseResume
     * @fires   Fight#startPauseResume
     * @private
     * @param   {Integer} forceMS Optional milliseconds the countdown should be forced to
     */
    function _startPauseResume(forceMS) {
        if (this.isStopped()) return

        if (!_countdownExists.call(this)) {
            _newCountDown.call(this, forceMS)
        } else {
            if (this[' countdown'].isComplete()) return
            if (typeof forceMS !== 'undefined') {
                var paused = this[' countdown'].isPaused()
                _newCountDown.call(this, forceMS)
                paused && this[' countdown'].pause('renew')
            }
            _togglePauseResume.call(this)
        }

        // do not register event listeners, if milliseconds were passed, because this means the
        // fight is controlled from the outside were the logic happens
        if (typeof forceMS !== 'undefined') return

        _dispatch.call(this, 'startPauseResume', this[' countdown'].get())
    }

    /**
     * Inverts passed side; Makes left from right and right from left - keeps center ...
     *
     * @private
     * @param   {String} side
     */
    function _invertSide(side) {
        if (side === Fight.SIDE_CENTER) return Fight.SIDE_CENTER
        return side === Fight.SIDE_RED ? Fight.SIDE_WHITE : Fight.SIDE_RED
    }

    /**
     * Creates a new object for the count up
     *
     * @private
     * @fires   Fight#toketa
     * @param   {String}  side defines which opponent holds the other down ("red", "white" or "center")
     * @param   {Integer} forceMS Optional milliseconds the start of count up should be set to
     */
    function _newCountUp(side, forceMS) {
        var local_ms   = forceMS || 0
        var countUp_ms = this[' settings'].getCountUpLimit()
        var to = typeof forceMS !== 'undefined' ? this[' settings'].getCountUpLimitIppon() : countUp_ms
        _countUpExists.call(this) && this[' countup'].stop('dirty')
        this[' countup'] = Durata.create(local_ms, to, to - local_ms)
        this[' countup'].side = side

        // do not register event listeners, if milliseconds were passed, because this means the
        // fight is controlled from the outside were the logic happens
        if (typeof forceMS !== 'undefined') return

        this[' countup'].on('pause', function () {
            _dispatch.call(this, 'toketa', this[' countup'].get())
        }.bind(this)).on('complete', function () {
            if (this[' ' + this[' countup'].side + 'Opponent'].getScore() !== 0) {
                ! this[' countdown'].isPaused() && this[' countdown'].pause('osaekomi-timeup')
                _dispatch.call(this, 'timeUp')
            } else {
                this[' countup'].stop('replace')
                _newCountUp.call(this, this[' countup'].side, countUp_ms)
                this[' countup'].on('pause', function () {
                    _dispatch.call(this, 'toketa', this[' countup'].get())
                }.bind(this)).on('complete', function () {
                    ! this[' countdown'].isPaused() && this[' countdown'].pause('osaekomi-timeup')
                    _dispatch.call(this, 'timeUp')
                }.bind(this))
            }
        }.bind(this))
    }

    /**
     * Starts count up for osae komi
     *
     * @method  Fight#osaeKomi
     * @fires   Fight#osaeKomi
     * @param   {String}  side defines which opponent holds the other down ("red", "white" or "center")
     * @param   {Integer} forceMS Milliseconds the count up should be forced to
     * @private
     */
    function _osaeKomi(side, forceMS) {
        if (typeof forceMS === 'undefined' && (
                this.isStopped() ||
                !_countdownExists.call(this) ||
                this[' countdown'].isPaused()
        )) return

        side = side || Fight.SIDE_CENTER
        side = this[' settings'].isGripSideInverted() ? _invertSide(side) : side

        if (!_countUpExists.call(this) || this[' countup'].isPaused() || typeof forceMS !== 'undefined') {
            _newCountUp.call(this, side, forceMS)
        } else {
            this[' countup'].side = side
        }

        // do not register event listeners, if milliseconds were passed, because this means the
        // fight is controlled from the outside were the logic happens
        if (typeof forceMS !== 'undefined') return

        _dispatch.call(this, 'osaeKomi', this[' settings'].isGripSideInverted() ? _invertSide(side) : side)
    }

    /**
     * Stops the fight
     *
     * @method  Fight#stop
     * @fires   Fight#stop
     * @param   {Integer} msDownForce Optional milliseconds the countdown should be forced to
     * @param   {Integer} msUpForce Optional milliseconds the count up should be forced to
     * @param   {String}  side defines which opponent holds the other down ("red", "white" or "center")
     * @private
     */
    function _stop(msDownForce, msUpForce, side) {
        this[' stopped'] = true
        if (typeof msDownForce === 'undefined') {
            this[' countdown'].stop('timeup')
        } else {
            _newCountDown.call(this, msDownForce)
            this[' countdown'].stop('timeup')
            _newCountUp.call(this, side, msUpForce)
        }
        _countUpExists.call(this) && this[' countup'].stop('timeup')

        // do not register event listeners, if milliseconds were passed, because this means the
        // fight is controlled from the outside were the logic happens
        if (typeof msDownForce !== 'undefined') return

        this[' whiteOpponent'].getPerson().setLockOut(this[' settings'].getLockOutTime())
        this[' redOpponent'].getPerson().setLockOut(this[' settings'].getLockOutTime())

        _dispatch.call(
            this, 'stop', [
                this[' countdown'].get(),
                _countUpExists.call(this) ? this[' countup'].get() : 0,
                _countUpExists.call(this) ? this[' countup'].side  : Fight.SIDE_CENTER
            ]
        )
    }

    /**
     * Pauses the count up for osae komi
     *
     * @method  Fight#toketa
     * @param   {Integer} forceMS Optional milliseconds the count up should be forced to
     * @private
     */
    function _toketa(forceMS) {
        if (typeof forceMS !== 'undefined') {
            _newCountUp.call(this, this[' countup'].side, forceMS)
        }

        _countUpExists.call(this) && this[' countup'].pause('toketa')
    }

    /**
     * Notifies all listeners of passed event-type.
     *
     * @private
     * @param {String} type
     * @param {*} data
     */
    function _dispatch(type, data) {
        !!this[' history'] && this[' history'].insert(type, data)

        this[' listener'][type].forEach(function (listener) {
            listener.call(this, data)
        }, this)
    }


    /**
     * Will be fired when the score and time of a fight has been reset
     * @event Fight#reset
     */

    /**
     * Will be fired when countdown has been started, paused or resumed
     * @event Fight#startPauseResume
     */

    /**
     * Will be fired when count up has been started
     * @event Fight#osaeKomi
     */

    /**
     * Will be fired when the countdown has been stopped (fight ended)
     * @event Fight#stop
     */

    /**
     * Will be fired when count up has been stopped
     * @event Fight#toketa
     */

    /**
     * Will be fired when count up has been removed
     * @event Fight#removeCountUp
     */

    // Module-API
    return {
        /**
         * Creates an object to manage a fight.
         *
         * @static
         * @method   create
         * @memberof "Direzione.Fight"
         * @param    {FightSettings} settings
         * @param    {Opponent}      thousandsSeparator
         * @param    {Opponent}      decimalCount
         * @param    {Boolean}       noHistory
         * @returns  {Fight}
         */
        create: function (settings, whiteOpponent, redOpponent, noHistory) {
            return new Fight(settings, whiteOpponent, redOpponent, noHistory);
        },

        // Constants to make accessable:
        DURATION:    Fight.DURATION,
        COUNTUP:     Fight.COUNTUP,
        LOCK_OUT:    Fight.LOCK_OUT,
        SIDE_WHITE:  Fight.SIDE_WHITE,
        SIDE_RED:    Fight.SIDE_RED,
        SIDE_CENTER: Fight.SIDE_CENTER
    }
}))
;
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
/** @namespace "Direzione.FightSettings" */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('direzione-lib/config/FightSettings',['direzione-lib/model/Fight'], factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../model/Fight'))
    } else {
        root.Direzione = root.Direzione || {};
        root.Direzione.FightSettings = factory(root.Direzione.Fight)
    }
}(this, function (Fight) {

    var SETTINGS  = ['duration', 'countUpLimit', 'countUpLimitIppon', 'personLockOut']

    /**
     * @class
     * @hideconstructor
     * @global
     * @private
     *
     * @borrows <anonymous>~_toStorage as toStorage
     * @borrows <anonymous>~_fromStorage as fromStorage
     */
    function FightSettings() {
        this.duration          = Fight.DURATION
        this.countUpLimit      = Fight.COUNTUP
        this.countUpLimitIppon = Fight.COUNTUP * 2
        this.personLockOut     = Fight.LOCK_OUT
        this.invertGripDisplay = false
        this.invertGripSide    = false

        this.fromStorage()
        this.fromURLParameters()
    }

    FightSettings.prototype = {
        toStorage:             _toStorage,
        fromStorage:           _fromStorage,
        fromURLParameters:     _fromURLParameters,
        getDuration:           function () { return this.duration },
        getCountUpLimit:       function () { return this.countUpLimit },
        getCountUpLimitIppon:  function () { return this.countUpLimitIppon },
        getLockOutTime:        function () { return this.personLockOut },
        isGripDisplayInverted: function () { return this.invertGripDisplay },
        isGripSideInverted:    function () { return this.invertGripSide },
        setDuration: function (duration) {
            if (! Number.isInteger(duration)) {
                throw TypeError('Duration has to be of type integer')
            }
            this.duration = duration
            return this
        },
        setCountUpLimit: function (countUpLimit) {
            if (! Number.isInteger(countUpLimit)) {
                throw TypeError('Limit for count up (wazari) has to be of type integer')
            }
            this.countUpLimit = countUpLimit
            return this
        },
        setCountUpLimitIppon: function (countUpLimit) {
            if (! Number.isInteger(countUpLimit)) {
                throw TypeError('Limit for count up (ippon) has to be of type integer')
            }
            this.countUpLimitIppon = countUpLimit
            return this
        },
        setLockOutTime: function (lockOutTime) {
            if (! Number.isInteger(lockOutTime)) {
                throw TypeError('The lock-out time has to be of type integer')
            }
            this.personLockOut = lockOutTime
            return this
        },
        setGripDisplayInverted: function (enable) {
            this.invertGripDisplay = !!enable
            return this
        },
        setGripSideInverted: function (enable) {
            this.invertGripSide = !!enable
            return this
        }
    }

    /**
     * Puts the settings to the local storage
     *
     * @method  FightSettings#toStorage
     * @public
     */
    function _toStorage() {
        localStorage.setItem('Direzione.FightSettings', JSON.stringify(this))
    }

    /**
     * Fetches the settings from the local storage and applies them to this object
     *
     * @method  FightSettings#fromStorage
     * @public
     */
    function _fromStorage() {
        var obj, settings = localStorage.getItem('Direzione.FightSettings')
        if (settings) {
            obj = JSON.parse(settings)
            Object.keys(obj).forEach(function (key) {
                this[key] = obj[key]
            }, this)
        }
    }

    /**
     * Fetches the settings from url parameters given in query and applies them to this object
     *
     * @method  AppSettings#fromURLParameters
     * @public
     */
    function _fromURLParameters() {
        var urlParams = new URLSearchParams(window.location.search)
        Array.from(urlParams.entries()).forEach(function (entry) {
            SETTINGS.includes(entry[0]) && (this[entry[0]] = entry[1])
        }, this)
    }

    // Module-API
    return {
        /**
         * Creates an object to manage settings to a fight
         *
         * @static
         * @method     create
         * @memberof   "Direzione.FightSettings"
         * @returns    {FightSettings}
         */
        create: function () {
            return new FightSettings()
        }
    }
}))
;
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
/** @namespace "Direzione.Opponent" */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('direzione-lib/model/Opponent',factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory()
    } else {
        root.Direzione = root.Direzione || {}
        root.Direzione.Opponent = factory()
    }
}(this, function () {

    /**
     * @class
     * @hideconstructor
     * @global
     * @private
     *
     * @param {Person}  person
     * @param {Integer} score
     * @param {Integer} penalty
     *
     * @borrows <anonymous>~_removeAllEventListeners as clearListeners
     * @borrows <anonymous>~_registerEventListener as on
     */
    function Opponent(person, score, penalty) {
        this[' person']  = person
        this[' score']   = score || 0
        this[' penalty'] = penalty || 0

        this[' listener'] = { add: [], remove: [], reset: [] }
    }

    /**
     * Score for wazari
     * @readonly
     * @const {number}
     */
    Opponent.SCORE_WAZARI  = 4

    /**
     * Score for ippon
     * @readonly
     * @const {number}
     */
    Opponent.SCORE_IPPON   = 8

    /**
     * Maximum score be able to reach in a fight
     * @readonly
     * @const {number}
     */
    Opponent.MAX_SCORE     = Opponent.SCORE_IPPON

    /**
     * Penalty point
     * @readonly
     * @const {number}
     */
    Opponent.PENALTY_SHIDO = 1

    /**
     * Maximum penalty of a opponent before he lose the fight
     * @readonly
     * @const {number}
     */
    Opponent.MAX_PENALTY   = Opponent.PENALTY_SHIDO * 3

    Opponent.prototype = {
        clearListeners: _removeAllEventListeners,
        addIppon: function () {
            if (this[' score'] >= Opponent.MAX_SCORE) return
            _dispatch.call(this, 'add', 'Ippon')
            this[' score'] = Opponent.SCORE_IPPON
        },
        addShido: function () {
            if (this[' penalty'] >= Opponent.MAX_PENALTY) return
            _dispatch.call(this, 'add', 'Shido')
            this[' penalty'] = this[' penalty'] + Opponent.PENALTY_SHIDO
        },
        addWazari: function () {
            if (this[' score'] >= Opponent.MAX_SCORE) return
            _dispatch.call(this, 'add', 'Wazari')
            this[' score'] = this[' score'] + Opponent.SCORE_WAZARI
        },
        getPerson: function () {
            return this[' person']
        },
        getFullName: function () {
            return this.getPerson().getFirstName() + ' ' + this.getPerson().getLastName()
        },
        getScore: function () {
            if (this[' score'] >= Opponent.MAX_SCORE) return Opponent.MAX_SCORE
            return this[' score']
        },
        getShido: function () {
            if (this[' penalty'] >= Opponent.MAX_PENALTY) return Opponent.MAX_PENALTY
            return this[' penalty']
        },
        on: _registerEventListener,
        removeIppon: function () {
            if (this[' score'] - Opponent.SCORE_IPPON < 0) return
            _dispatch.call(this, 'remove', 'Ippon')
            this[' score'] = this[' score'] - Opponent.SCORE_IPPON
        },
        removeShido: function () {
            if (this[' penalty'] <= 0) return
            _dispatch.call(this, 'remove', 'Shido')
            this[' penalty'] = this[' penalty'] - Opponent.PENALTY_SHIDO
        },
        removeWazari: function () {
            if (this[' score'] <= 0) return
            _dispatch.call(this, 'remove', 'Wazari')
            this[' score'] = this[' score'] - Opponent.SCORE_WAZARI
        },
        reset: function () {
            _dispatch.call(this, 'reset')
            this[' score'] = 0
            this[' penalty'] = 0
            this.getPerson().reset()
        }
    }

    /**
     * Registers an event-listener to this object
     *
     * @method  Opponent#on
     * @param   {String} type
     * @param   {Function} callback
     * @public
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
     * Removes all listerners of this object
     *
     * @method  Opponent#clearListeners
     * @public
     */
    function _removeAllEventListeners() {
        var eventTypes = Object.keys(this[' listener'])
        eventTypes.forEach(function (key) {
            delete this[' listener'][key]
            this[' listener'][key] = []
        }, this)
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

        /**
         * Returns the name of the club, where the opponent is member of
         *
         * @method  Opponent#getClubName
         * @public
         * @returns {String}
         */

        /**
         * Returns the firstname and lastname of the opponent
         *
         * @method  Opponent#getFullName
         * @public
         * @returns {String}
         */

        /**
         * Returns the score of the opponent
         *
         * @method  Opponent#getScore
         * @public
         * @returns {Integer}
         */

        /**
         * Returns the penalty score of the opponent
         *
         * @method  Opponent#getShido
         * @public
         * @returns {Integer}
         */

        /**
         * Adds amount of points for ippon to score of the opponent
         *
         * @method  Opponent#addIppon
         * @fires   Opponent#add
         * @public
         */

        /**
         * Adds a penalty point to the penalty score of the opponent
         *
         * @method  Opponent#addShido
         * @fires   Opponent#add
         * @public
         */

        /**
         * Adds amount of points for wazari to score of the opponent
         *
         * @method  Opponent#addWazari
         * @fires   Opponent#add
         * @public
         */

        /**
         * Removes amount of points for ippon from score of the opponent
         *
         * @method  Opponent#removeIppon
         * @fires   Opponent#remove
         * @public
         */

        /**
         * Removes a penalty point from the penalty score of the opponent
         *
         * @method  Opponent#removeShido
         * @fires   Opponent#remove
         * @public
         */

        /**
         * Removes amount of points for wazari from score of the opponent
         *
         * @method  Opponent#removeWazari
         * @fires   Opponent#remove
         * @public
         */

        /**
         * Resets the score and penalty of the opponent
         *
         * @method  Opponent#reset
         * @fires   Opponent#reset
         * @public
         */

    /**
     * Will be fired when score has been changed, when added
     * @event Opponent#add
     */

    /**
     * Will be fired when score has been changed, when removed
     * @event Opponent#remove
     */

    /**
     * Will be fired when score has been reset
     * @event Opponent#reset
     */

    // Module-API
    return {
        /**
         * Creates an object to manage a opponent (in a fight).
         *
         * @static
         * @method   create
         * @memberof "Direzione.Opponent"
         * @param    {Person}  person
         * @param    {Integer} score
         * @param    {Integer} penalty
         * @returns  {Opponent}
         */
        create: function (person, score, penalty) {
            return new Opponent(person, score, penalty)
        }
    }
}))
;
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
/** @namespace "Direzione.Person" */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('direzione-lib/model/Person',['durata/dist/durata.min'], factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('durata'))
    } else {
        root.Direzione = root.Direzione || {}
        root.Direzione.Person = factory(root.Durata)
    }
}(this, function (Durata) {

    /**
     * @class
     * @hideconstructor
     * @global
     * @private
     *
     * @param   {String} firstName
     * @param   {String} lastName
     * @param   {String} club
     */
    function Person (firstName, lastName, club) {
        this[' firstName'] = firstName
        this[' lastName']  = lastName
        this[' club']      = club
    }

    Person.prototype = {
        getClubName: function () {
            return this[' club']
        },
        getFirstName: function () {
            return this[' firstName']
        },
        getLastName: function () {
            return this[' lastName']
        },
        setLockOut: function (ms) {
            this.reset()
            this[' lockout'] = Durata.create(ms, 0, ms)
        },
        getLockOut: function () {
            return typeof this[' lockout'] === 'undefined' ? false : this[' lockout']
        },
        reset: function () {
            (typeof this[' lockout'] !== 'undefined') && this[' lockout'].stop()
            delete this[' lockout']
        }
    }

    /**
     * Returns the name of the club, where the Person is member of
     *
     * @method  Person#getClubName
     * @public
     * @returns {String}
     */

    /**
     * Returns the firstname of the Person
     *
     * @method  Person#getFirstName
     * @public
     * @returns {String}
     */

    /**
     * Returns the lastname of the Person
     *
     * @method  Person#getLastName
     * @public
     * @returns {String}
     */

    /**
     * Sets persons lock-out time in milliseconds
     *
     * @method  Person#getLockOut
     * @param   {Integer} ms
     * @public
     */

    /**
     * Returns the lock-out, if set
     *
     * @method  Person#getLockOut
     * @public
     * @returns {false|Durata}
     */

    /**
     * Resets the lock-out
     *
     * @method  Person#reset
     * @public
     */

    // Module-API
    return {
        /**
         * Creates an object to manage a fight.
         *
         * @static
         * @method   create
         * @memberof "Direzione.Person"
         * @param   {String} firstName
         * @param   {String} lastName
         * @param   {String} club
         * @returns {Person}
         */
        create: function (firstName, lastName, club) {
            return new Person(firstName, lastName, club);
        }
    }
}))
;
/**
 * Code adopted from project "doublylinked" (extracted only needed portions)
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
/** @namespace "Direzione.Playlist" */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('direzione-lib/model/Playlist',factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory()
    } else {
        root.Direzione = root.Direzione || {}
        root.Direzione.Playlist = factory()
    }
}(this, function () {

    /**
     * Class to manage a list of fights as playlist
     *
     * @class
     * @hideconstructor
     * @global
     * @private
     *
     * @borrows <anonymous>~_find as find
     * @borrows <anonymous>~_insert as insert
     * @borrows <anonymous>~_includes as includes
     * @borrows <anonymous>~_next as next
     * @borrows <anonymous>~_prev as prev
     * @borrows <anonymous>~_reset as reset
     * @borrows <anonymous>~_remove as remove
     */
    function Playlist() {
        this[' cursor'] = undefined;
        this[' head']   = undefined;
        this[' tail']   = undefined;
        this[' length'] = 0;
        this[' eof']    = false;
    }

    Playlist.prototype = {
        find:     _find,
        insert:   _insert,
        includes: _includes,
        next:     _next,
        prev:     _prev,
        reset:    _reset,
        remove:   _remove
    }

        /**
         * Class to manage the entries in the playlist
         *
         * @constructor
         * @global
         * @private
         * @param {Playlist} list
         * @param {Fight} fight
         */
        function Entry(list, fight) {
            this[' list']  = list
            this[' value'] = fight
            this[' prev']  = undefined
            this[' next']  = undefined
        }

        /**
         * Removes the entry, which this function called with, from playlist
         */
        function _removeEntry() {
            if (!this[' list'])
                return
            if (this[' prev'])
                this[' prev'][' next'] = this[' next']
            if (this[' next'])
                this[' next'][' prev'] = this[' prev']
            if (this === this[' list'][' cursor'])
                this[' list'][' cursor'] = this[' next'] || this[' prev']
            if (this === this[' list'][' head'])
                this[' list'][' head'] = this[' next']
            if (this === this[' list'][' tail'])
                this[' list'][' tail'] = this[' prev']
            this[' list'][' length']--
            // support garbage collection
            this[' prev'] = undefined
            this[' next'] = undefined
            this[' list'] = undefined
        }


   /**
    * Adds a fight object right after the cursor node of the playlist and returns
    * the new length of the list
    *
    * @method  Playlist#insert
    * @param   {Fight} fight
    * @returns {int} - The new length of the list
    * @public
    */
   function _insert(fight) {
        var node = new Entry(this, fight)
        if (!this[' length']) {
            this[' head']   = node
            this[' tail']   = node
            this[' cursor'] = node
        } else if (typeof this[' cursor'] === 'undefined') {
            this[' head'][' prev'] = node
            node[' next']          = this[' head']
            this[' head']          = node
        } else {
            if (typeof this[' cursor'][' next'] === 'undefined')
                this[' tail'] = node
            else
                this[' cursor'][' next'][' prev'] = node

            node[' next']            = this[' cursor'][' next']
            this[' cursor'][' next'] = node
            node[' prev']            = this[' cursor']
            this[' cursor']          = node
        }
        this[' length']++;
        this[' eof'] = false;

        return this[' length'];
    }

    /**
     * Returns the value of the first fight-element in the list that satisfies
     * the provided testing function. Otherwise undefined is returned
     *
     * @method  Playlist#find
     * @param {Function} callback - Function to test for each fight-element
     * @param {int} [fromIndex = 0] - The position in this list at which to begin searching for searchElement
     * @return {Fight|undefined} - A value in the list if a fight-element passes the test; otherwise, undefined
     * @public
     */
    function _find(callback, fromIndex) {
        if (typeof callback !== 'function')
            throw new TypeError('You must provide a function as first argument')
        if (!this[' length'])
            return

        fromIndex = fromIndex || 0
        if (fromIndex < 0)
            fromIndex = this[' length'] + fromIndex

        var tmp = this[' head'];
        for (var i = 0; i < this[' length']; i++) {
            if (i >= fromIndex && callback(tmp[' value'], i)) {
                this[' cursor'] = tmp
                this[' eof'] = false
                return tmp[' value']
            }
            tmp = tmp[' next']
        }
        this[' cursor'] = undefined
    }

    /**
     * Determines whether a list includes a certain fight-element,
     * returning true or false as appropriate
     *
     * @method  Playlist#includes
     * @param {Fight} searchElement - The fight-element to search for
     * @param {int} [fromIndex = 0] - The position in this list at which to begin searching for searchElement
     * @return {Boolean} - true if the searchElement found in the list; otherwise, false
     * @public
     */
    function _includes(searchElement, fromIndex) {
        _find.call(this, function (element) {
            return Object.is(element, searchElement)
        }, fromIndex)
        return !!this[' cursor']
    }

    /**
     * Removes a fight-element from the list
     *
     * @method  Playlist#remove
     * @param {Fight} fight - The fight-element to be removed from playlist
     * @param {int} [fromIndex = 0] - The position in this list at which to begin searching for the fight-element
     * @return {Fight} - Returns removed fight-element if found, undefined otherwise
     * @public
     */
    function _remove(fight, fromIndex) {
        if (_includes.call(this, fight, fromIndex)) {
            var cur = this[' cursor']
            _removeEntry.call(cur)
            _reset.call(this)
            return cur[' value']
        }
    }

    /**
     * Moves cursor to the next entry and returns the fight-object in it
     *
     * @method  Playlist#next
     * @return {Fight} - Returns fight-object of next node to the cursor. If cursor reaches to the end, it returns undefined
     * @public
     */
    function _next() {
        if (this[' cursor'] === this[' tail']) {
            this[' eof'] = true
            return undefined
        }
        var c = this[' cursor'] ? this[' cursor'][' next'] : this[' head']
        this[' cursor'] = c
        return c && c[' value']
    }

    /**
     * Moves cursor to the previous entry and returns the fight-object in it
     *
     * @method  Playlist#prev
     * @return {Fight} - Returns fight-object of previous node to the cursor. If cursor reaches to the head, it returns undefined
     * @public
     */
    function _prev() {
        var c
        if (this[' eof']) {
            this[' eof'] = false;
            c = this[' cursor'] = this[' tail']
            return c && c[' value']
        }
        c = this[' cursor'] && this[' cursor'][' prev']
        this[' cursor'] = c
        return c && c[' value']
    }

    /**
     * Resets cursor to head
     *
     * @method  Playlist#reset
     * @return {Playlist} - Returns the Playlist instance which this method is called
     * @public
     */
    function _reset() {
        this[' cursor'] = undefined
        this[' eof']    = false
        return this
    }

    // Module-API
    return {
        /**
         * Creates an object of a double linked list holding fights and acts as playlist.
         *
         * @static
         * @method   create
         * @memberof "Direzione.Playlist"
         * @returns {Playlist}
         */
        create: function () {
            return new Playlist()
        }
    }
}))
;
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
/** @namespace "Direzione.Utils" */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('direzione-lib/util/Utils',factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory()
    } else {
        root.Direzione = root.Direzione || {}
        root.Direzione.Utils = factory()
    }
}(this, function () {

    /**
     * Loads a JS-file from a given path and passes the so (hopefully) loaded
     * member variable "Direzione.translation" to the given callback-function
     *
     * @public
     * @static
     * @method   loadTranslationJS
     * @memberof "Direzione.Utils"
     *
     * @param    {String} path
     * @param    {Function} callback
     *
     * @returns  {String}
     */
    function loadTranslationJS(path, callback) {
        var script = document.createElement('script');

        script.onload = function () {
            callback(Direzione.translation)
        };
        script.src = path;

        document.head.appendChild(script);
    }

    /**
     * Returns converted milliseconds as string showing minutes and seconds
     *
     * @private
     * @param   {Integer} timeLeft_msec
     * @returns {String}
     */
    function getMinSecDisplay(timeLeft_msec) {
        var timeLeft_sec  = Math.ceil(timeLeft_msec / 1000)
        return (Math.floor(timeLeft_sec/60) + ':' + ((timeLeft_sec%60)+'').padStart(2,'0'))
    }

    // Module-API
    return {
        loadTranslationJS: loadTranslationJS,
        getMinSecDisplay:  getMinSecDisplay
    }
}))
;
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
 *
 * @license GPL-3.0
 *
 * @returns {Object}
 */
/** @namespace "Direzione.Scoreboard" */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('direzione-lib/view/Scoreboard',['direzione-lib/model/Fight', 'direzione-lib/util/Utils'], factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../model/Fight'), require('../util/Utils'))
    } else {
        root.Direzione = root.Direzione || {}
        root.Direzione.Scoreboard = factory(root.Direzione.Fight, root.Direzione.Utils)
    }
}(this, function (Fight, Utils) {

    /**
     * @class
     * @hideconstructor
     * @global
     * @private
     *
     * @param   {Fight}  fightModel
     * @param   {Object} viewConfig
     */
    function Scoreboard(fightModel, viewConfig) {
        this[' fight'] = fightModel
        this[' outputElems'] = {
            countdown:     viewConfig.outputElemCountdown,
            clockSec:      viewConfig.outputElemStopwatchSeconds,
            clockMSec:     viewConfig.outputElemStopwatchMilliseconds,
            whiteScore:    viewConfig.outputElemWhiteScore,
            redScore:      viewConfig.outputElemRedScore,
            whiteShido:    viewConfig.outputElemWhiteShido,
            redShido:      viewConfig.outputElemRedShido,
            whiteOpponent: viewConfig.outputElemWhiteOpponent,
            redOpponent:   viewConfig.outputElemRedOpponent,
            whiteClub:     viewConfig.outputElemWhiteClub,
            redClub:       viewConfig.outputElemRedClub
        }

        this[' initValMemCountdown'] = viewConfig.outputElemCountdown.innerText
        this.showNames()
        this.run()
    }
    Scoreboard.prototype = {
        replaceFight: function (fightModel) {
            this.stop()
            this[' fight'] = fightModel
            this.showNames()
            this.run()
        },
        run: function () {
            this[' allowRun'] = true
            requestAnimationFrame(this[' animationLoop'] = function() {
                _updateView.call(this)
                this[' allowRun']
                    ? requestAnimationFrame(this[' animationLoop'])
                    : (this[' allowRun'] = true)
            }.bind(this))
        },
        stop: function () {
            this[' allowRun'] = false
        },
        showNames: function () {
            this[' outputElems'].whiteOpponent.innerText = this[' fight'].getWhiteOpponent().getFullName()
            this[' outputElems'].redOpponent.innerText   = this[' fight'].getRedOpponent().getFullName()
            this[' outputElems'].whiteClub.innerText     = this[' fight'].getWhiteOpponent().getPerson().getClubName()
            this[' outputElems'].redClub.innerText       = this[' fight'].getRedOpponent().getPerson().getClubName()
        },
        hideNames: function () {
            this[' outputElems'].whiteOpponent.innerText = ''
            this[' outputElems'].redOpponent.innerText   = ''
            this[' outputElems'].whiteClub.innerText   = ''
            this[' outputElems'].redClub.innerText     = ''
        },
        shutdown: function () {
            this.stop()
            this.hideNames()
            requestAnimationFrame(function () {
                this[' outputElems'].countdown.innerText   = this[' initValMemCountdown']
                this[' outputElems'].clockSec.innerText    = _displaySecPassed(0)
                this[' outputElems'].clockMSec.innerText   = _displayMSecPassed(0)
                this[' outputElems'].clockSec.parentNode.className = Fight.SIDE_CENTER

                this[' outputElems'].whiteScore.innerText = 0
                this[' outputElems'].redScore.innerText   = 0

                this[' outputElems'].whiteShido.innerText = 0
                this[' outputElems'].redShido.innerText   = 0
            }.bind(this))
        }
    }

    /**
     * Starts the update process for the display
     *
     * @method  Scoreboard#run
     * @public
     */

    /**
     * Stops the update process for the display
     *
     * @method  Scoreboard#stop
     * @public
     */

    /**
     * Replaces the present fight
     *
     * @method  Scoreboard#replaceFight
     * @public
     */

    /**
     * Displays Names of opponents
     *
     * @method  Scoreboard#showNames
     * @public
     */

    /**
     * Hides Names of opponents
     *
     * @method  Scoreboard#hideNames
     * @public
     */

    /**
     * Shuts the scoreboard display down
     *
     * @method  Scoreboard#shutdown
     * @public
     */

    /**
     * Extracts last three milliseconds and fills up with zeros to the left, if necessary
     *
     * @private
     * @param   {Integer} msec
     * @returns {String}
     */
    function _displayMSecPassed(msec) {
        return (Math.floor(msec%1000)+'').padStart(3,'0')
    }

    /**
     * Extracts seconds (without minutes) from  milliseconds
     *
     * @private
     * @param   {Integer} msec
     * @returns {Integer}
     */
    function _displaySecPassed(msec) {
        return Math.floor(msec / 1000)%60
    }

    /**
     * Shows the data of given fight
     *
     * @private
     */
    function _updateView() {
        this[' outputElems'].countdown.innerText = Utils.getMinSecDisplay(this[' fight'].getTimeLeft())
        var countup = this[' fight'].getCountUp()
        if (countup) {
            var milliseconds = countup.get()
            this[' outputElems'].clockSec.innerText  = _displaySecPassed(milliseconds)
            this[' outputElems'].clockMSec.innerText = _displayMSecPassed(milliseconds)
            this[' outputElems'].clockSec.parentNode.className
                = this[' fight'][' settings'].isGripDisplayInverted()
                    ? this[' fight'].invertSide(countup.side) : countup.side
        } else {
            this[' outputElems'].clockSec.innerText  = _displaySecPassed(0)
            this[' outputElems'].clockMSec.innerText = _displayMSecPassed(0)
            this[' outputElems'].clockSec.parentNode.className = Fight.SIDE_CENTER
        }

        this[' outputElems'].whiteScore.innerText = this[' fight'].getWhiteOpponent().getScore()
        this[' outputElems'].redScore.innerText   = this[' fight'].getRedOpponent().getScore()

        this[' outputElems'].whiteShido.innerText = this[' fight'].getWhiteOpponent().getShido()
        this[' outputElems'].redShido.innerText   = this[' fight'].getRedOpponent().getShido()
    }

    // Module-API
    return {
        /**
         * Creates an object to update a scoreboard.
         *
         * @static
         * @method   create
         * @memberof "Direzione.Scoreboard"
         * @param   {Fight}  fightModel
         * @param   {Object} viewConfig
         * @returns {Scoreboard}
         */
        create: function (fightModel, viewConfig) {
            return new Scoreboard(fightModel, viewConfig)
        }
    }
}))
;
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
 *
 * @license GPL-3.0
 *
 * @returns {Object}
 */
/** @namespace "Direzione.FightEmitter" */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('direzione-lib/service/FightEmitter',['peerjs/dist/peerjs.min'], factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('peerjs'))
    } else {
        root.Direzione = root.Direzione || {};
        root.Direzione.FightEmitter = factory(root.peerjs)
    }
}(this, function (peerjs) {

    /**
     * @class
     * @hideconstructor
     * @global
     * @private
     *
     * @param   {String}  receiverID
     * @param   {Fight}   fight
     * @param   {Array}   servers
     *
     * @borrows <anonymous>~_connect as connect
     * @borrows <anonymous>~_registerEventListener as on
     */
    function FightEmitter(receiverID, fight, servers) {
        var servers = servers || []
        var options = servers.length < 1 ? {} : {config: {iceServers: servers}}

        this[' localPeer']  = new peerjs.Peer(options)
        this[' fight']      = fight
        this[' receiverID'] = receiverID
        this[' connected']  = false
        this[' conn']       = false
        this[' listener']   = {disconnect: [], establish: []}

        _registerFightHandlers.call(this)
    }
    FightEmitter.prototype = {
        connect:     _connect,
        disconnect:  _disconnect,
        isConnected: function () {
            return this[' connected']
        },
        on: _registerEventListener,
        getFight: function () {
            return this[' fight']
        },
        replaceFight: function (fight) {
            this.disconnect()
            this[' fight'].clearListeners()
            delete this[' fight']
            this[' fight'] = fight
            _registerFightHandlers.call(this)
        }
    }

    /**
     * Returns whether the connection to a FightReceiver is established
     *
     * @method  FightEmitter#isConnected
     * @public
     * @returns {Boolean}
     */

    /**
     * Returns the fight
     *
     * @method FightEmitter#getFight
     * @public
     */

    /**
     * Replaces the fight of this emitter and emits the new object
     *
     * @method FightEmitter#replaceFight
     * @public
     */

    /**
     * Emits fight over the connection, if established
     *
     * @private
     */
    function _emitFight() {
        var cu;
        function opponent4Emitter(side, opponent) {
            return [
                'new', side,
                opponent.getPerson().getFirstName(),
                opponent.getPerson().getLastName(),
                opponent.getPerson().getClubName(),
                opponent.getScore(),
                opponent.getShido()
            ]
        }

        _send.call(this, opponent4Emitter('white', this[' fight'].getWhiteOpponent()));
        _send.call(this, opponent4Emitter('red',   this[' fight'].getRedOpponent()));
        _send.call(this, [
            'new', 'fight', this[' fight'].getTimeLeft(),
            this[' fight'][' settings'].getCountUpLimit(),
            this[' fight'][' settings'].getCountUpLimitIppon(),
            this[' fight'][' settings'].isGripDisplayInverted(),
            this[' fight'][' settings'].isGripSideInverted()
        ]);
        if (this[' fight'].isRunning()) {
            _send.call(this, ['fight', 'startPauseResume', this[' fight'].getTimeLeft()])
        }
        if (cu = this[' fight'].getCountUp()) {
            var status = cu.isComplete() ? 4 : cu.isStopped() ? 3 : cu.isPaused() ? 2 : 1
            var side   = this[' fight'][' settings'].isGripSideInverted()
                            ? this[' fight'].invertSide(cu.side) : cu.side
            _send.call(this, ['new', 'countup', side, cu.get(), status])
        }
    }

    /**
     * Trys to disconnect from the connected FightReceiver
     *
     * @public
     * @method  FightEmitter#disconnect
     */
    function _disconnect() {
        return this[' connected'] && this[' conn'].close() || true
    }

    /**
     * Trys to connect to a FightReceiver with given ID
     *
     * @public
     * @method  FightEmitter#connect
     * @fires   FightEmitter#establish
     * @fires   FightEmitter#disconnect
     * @returns {Promise}
     */
    function _connect() {
        var deferred = {resolve: null, reject: null};
        deferred.promise = new Promise(function (resolve, reject) {
            deferred.resolve = resolve
            deferred.reject  = reject
        })

        this[' conn'] = this[' localPeer'].connect(this[' receiverID'])
        this[' conn'].on('open', function() {
            this[' connected'] = true
            _emitFight.call(this)
            _dispatch.call(this, 'establish', 'peer opened')
            deferred.resolve()
        }.bind(this))
        this[' conn'].on('close', function() {
            this[' connected'] = false
            _dispatch.call(this, 'disconnect', 'peer closed')
        }.bind(this))

        return deferred.promise
    }

    /**
     * Sends data over the connection, if established
     *
     * @private
     */
    function _send(data) {
        this.isConnected() && this[' conn'].send(data)
    }

    /**
     * Registers handlers that listening on events fired by components of the fight
     *
     * @private
     */
    function _registerFightHandlers() {
        var red   = this[' fight'].getRedOpponent()
        var white = this[' fight'].getWhiteOpponent()

        this[' fight'].on('reset', function (ms) {
            _send.call(this, ['fight', 'reset', ms])
        }.bind(this))
        this[' fight'].on('startPauseResume', function (ms) {
            _send.call(this, ['fight', 'startPauseResume', ms])
        }.bind(this))
        this[' fight'].on('stop', function (data) {
            _send.call(this, ['fight', 'stop', data[0], data[1], data[2]])
        }.bind(this))
        this[' fight'].on('toketa', function (ms) {
            _send.call(this, ['fight', 'toketa', ms])
        }.bind(this))
        this[' fight'].on('osaeKomi', function (side) {
            _send.call(this, ['fight', 'osaeKomi', side])
        }.bind(this))
        this[' fight'].on('removeCountUp', function () {
            _send.call(this, ['fight', 'removeCountUp'])
        }.bind(this))

        red.on('add', function (what) {
            _send.call(this, ['red', 'add'+what])
        }.bind(this)).on('remove', function (what) {
            _send.call(this, ['red', 'remove'+what])
        }.bind(this))

        white.on('add', function (what) {
            _send.call(this, ['white', 'add'+what])
        }.bind(this)).on('remove', function (what) {
            _send.call(this, ['white', 'remove'+what])
        }.bind(this))
    }

    /**
     * Registers an event-listener to this object
     *
     * @public
     * @method  FightEmitter#on
     * @param   {String} type
     * @param   {Function} callback
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

    /**
     * Will be fired when peer connection was disconnected
     * @event FightEmitter#disconnect
     */

    /**
     * Will be fired when peer connection has been established
     * @event FightEmitter#establish
     */

    // Module-API
    return {
        /**
         * Creates an object to emit fight events to a receiver.
         *
         * @static
         * @method   create
         * @memberof "Direzione.FightEmitter"
         * @param   {String} receiverID
         * @param   {Fight}  fight
         * @returns {FightEmitter}
         */
        create: function (receiverID, fight) {
            return new FightEmitter(receiverID, fight)
        }
    }
}))
;
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
 *
 * @license GPL-3.0
 *
 * @returns {Object}
 */
/** @namespace "Direzione.FightReceiver" */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('direzione-lib/service/FightReceiver',[
            'peerjs/dist/peerjs.min',
            'direzione-lib/model/Fight',
            'direzione-lib/config/FightSettings',
            'direzione-lib/model/Opponent',
            'direzione-lib/model/Person',
            'direzione-lib/view/Scoreboard'
        ], factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(
            require('peerjs'),
            require('../model/Fight'),
            require('../config/FightSettings'),
            require('../model/Opponent'),
            require('../model/Person'),
            require('../view/Scoreboard')
        )
    } else {
        root.Direzione = root.Direzione || {};
        root.Direzione.FightReceiver = factory(
            root.peerjs,
            root.Direzione.Fight,
            root.Direzione.FightSettings,
            root.Direzione.Opponent,
            root.Direzione.Person,
            root.Direzione.Scoreboard
        )
    }
}(this, function (peerjs, Fight, FightSettings, Opponent, Person, Scoreboard) {

    /**
     * @class
     * @hideconstructor
     * @global
     * @private
     *
     * @param   {String} receiverID
     * @param   {Object} viewConfig
     * @param   {Array}  servers
     *
     * @borrows <anonymous>~_registerEventListener as on
     */
    function FightReceiver(receiverID, viewConfig, servers) {
        var servers = servers || []
        var options = servers.length < 1 ? {} : {config: {iceServers: servers}}

        this[' localPeer']     = new peerjs.Peer(receiverID, options)
        this[' receiverID']    = receiverID
        this[' connected']     = false
        this[' conn']          = false
        this[' viewConfig']    = viewConfig
        this[' listener']      = {disconnect: [], establish: []}
        this[' redOpponent']   = null
        this[' whiteOpponent'] = null
        this[' fight']         = null
        this[' board']         = null

        _listen.call(this)
    }
    FightReceiver.prototype = {
        isConnected: function () {
            return this[' connected']
        },
        on: _registerEventListener
    }

    /**
     * Returns whether the connection to a FightReceiver is established
     *
     * @method  FightReceiver#isConnected
     * @public
     * @returns {Boolean}
     */

    /**
     * Handles data coming from FightEmitter
     *
     * @private
     * @param {String} type
     * @param {*} data
     */
    function _onData(data) {
        if (data[0] === 'new') {
            switch (data[1]) {
                case 'red':   return this[' redOpponent']   =
                    Opponent.create(Person.create(data[2], data[3], data[4]), data[5], data[6])
                case 'white': return this[' whiteOpponent'] =
                    Opponent.create(Person.create(data[2], data[3], data[4]), data[5], data[6])
                case 'fight':
                    var settings = FightSettings.create()
                    settings
                        .setDuration(data[2])
                        .setCountUpLimit(data[3])
                        .setCountUpLimitIppon(data[4])
                        .setGripDisplayInverted(data[5])
                        .setGripSideInverted(data[6])
                    this[' fight'] = Fight.create(settings, this[' whiteOpponent'], this[' redOpponent'], true)
                    this[' board'] = Scoreboard.create(this[' fight'], this[' viewConfig'])
                return
                case 'countup':
                    this[' fight'].osaeKomi(data[2], data[3])
                    if ([4, 3, 2].indexOf(data[4]) !== -1) return this[' fight'].toketa(data[3])
                return
            }
        }

        switch (data[0]) {
            case 'fight': return this[' fight'][data[1]](
                (3 <= data.length ? data[2] : undefined),
                (4 <= data.length ? data[3] : undefined),
                (5 <= data.length ? data[4] : undefined)
            )
            case 'red':   return this[' redOpponent'][data[1]]()
            case 'white': return this[' whiteOpponent'][data[1]]()
        }
    }

    /**
     * Listens to the connection expected from FightEmitter
     *
     * @private
     * @fires   FightReceiver#establish
     * @fires   FightReceiver#disconnect
     * @param   {String} type
     * @param   {*} data
     */
    function _listen() {
        this[' localPeer'].on('connection', function(conn) {
            this[' conn'] = conn
            conn.on('open', function() {
                this[' connected'] = true
                _dispatch.call(this, 'establish', 'peer opened')
                // Receive messages
                conn.on('data', _onData.bind(this))
            }.bind(this))
            conn.on('close', function() {
                this[' connected'] = false
                this[' board'].shutdown()
                _dispatch.call(this, 'disconnect', 'peer closed')
            }.bind(this))
        }.bind(this))
    }

    /**
     * Will be fired when peer connection was disconnected
     * @event FightReceiver#disconnect
     */

    /**
     * Will be fired when peer connection has been established
     * @event FightReceiver#establish
     */

    /**
     * Registers an event-listener to this object
     *
     * @public
     * @method  FightReceiver#on
     * @param   {String} type
     * @param   {Function} callback
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
        /**
         * Creates an object to receive scoreboard events from a emitter scoreboard.
         *
         * @static
         * @method   create
         * @memberof "Direzione.FightReceiver"
         * @param   {String} receiverID
         * @param   {Object} viewConfig
         * @returns {FightReceiver}
         */
        create: function (receiverID, viewConfig) {
            return new FightReceiver(receiverID, viewConfig)
        }
    }
}))
;
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
 *
 * @license GPL-3.0
 *
 * @returns {Object}
 */
/** @namespace "Direzione.Repertoire" */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('direzione-lib/view/Repertoire',['direzione-lib/model/Playlist', 'direzione-lib/util/Utils'], factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../model/Playlist'), require('../util/Utils'))
    } else {
        root.Direzione = root.Direzione || {}
        root.Direzione.Repertoire = factory(root.Direzione.Playlist, root.Direzione.Utils)
    }
}(this, function (Playlist, Utils) {

    /**
     * @class
     * @hideconstructor
     * @global
     * @private
     *
     * @param   {Playlist} playlistModel
     * @param   {Object}   viewConfig
     *
     * @borrows <anonymous>~_connect as connect
     * @borrows <anonymous>~_registerEventListener as on
     */
    function Repertoire(playlistModel, viewConfig) {
        this[' playlist']        = playlistModel
        this[' entryJig']        = viewConfig.entryJigElem.cloneNode(true)
        this[' entryWrapper']    = viewConfig.entryWrapperElem
        this[' cssWhiteName']    = viewConfig.selectorWhiteOpponentName || '.white'
        this[' cssRedName']      = viewConfig.selectorRedOpponentName   || '.red'
        this[' cssWhiteLockOut'] = viewConfig.selectorWhiteOpponentLockOut
        this[' cssRedLockOut']   = viewConfig.selectorRedOpponentLockOut

        viewConfig.entryJigElem.remove();

        this[' entryJig'].removeAttribute('id')
        _makeListVisual.call(this)
        _animationLoop.call(this)
    }

    /**
     * @private
     */
    function _animationLoop() {
        this[' entryWrapper'].querySelectorAll('li').forEach(function (entry) {
            if (typeof entry.fight === 'undefined') return

            var lockOutWhite = entry.fight.getWhiteOpponent().getPerson().getLockOut()
            var lockOutRed   = entry.fight.getRedOpponent().getPerson().getLockOut()
            var loWhiteElem  = entry.querySelector(this[' cssWhiteLockOut'])
            var loRedElem    = entry.querySelector(this[' cssRedLockOut'])

            if (loWhiteElem) {
                loWhiteElem.innerText = (! lockOutWhite || lockOutWhite.get() < 1)
                    ? '-:--' : Utils.getMinSecDisplay(lockOutWhite.get())
            }
            if (loRedElem) {
                loRedElem.innerText = (! lockOutRed || lockOutRed.get() < 1)
                    ? '-:--' : Utils.getMinSecDisplay(lockOutRed.get())
            }
        }.bind(this))
        requestAnimationFrame(_animationLoop.bind(this))
    }

    /**
     * @private
     */
    function _makeListVisual() {
        var fight, entry
        this[' playlist'].reset()
        while (fight = this[' playlist'].next()) {
            entry = this[' entryJig'].cloneNode(true)
            entry.fight = fight
            entry.querySelector(this[' cssWhiteName']).innerText = fight.getWhiteOpponent().getFullName()
            entry.querySelector(this[' cssRedName']).innerText   = fight.getRedOpponent().getFullName()

            this[' entryWrapper'].appendChild(entry)
        }
    }

    // Module-API
    return {
        /**
         * Creates an object to update a scoreboard.
         *
         * @static
         * @method   create
         * @memberof "Direzione.Repertoire"
         * @param   {Playlist} playlistModel
         * @param   {Object} viewConfig
         * @returns {Repertoire}
         */
        create: function (playlistModel, viewConfig) {
            return new Repertoire(playlistModel, viewConfig)
        }
    };
}));

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
        define('direzione-lib/model/Tournament',[
            'direzione-lib/model/Fight',
            'direzione-lib/model/FightHistory',
            'direzione-lib/config/FightSettings',
            'direzione-lib/model/Opponent',
            'direzione-lib/model/Person',
            'direzione-lib/view/Scoreboard',
            'direzione-lib/service/FightEmitter',
            'direzione-lib/service/FightReceiver',
            'direzione-lib/model/Playlist',
            'direzione-lib/view/Repertoire',
            'direzione-lib/util/Utils'
        ],factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(
            require('./Fight'),
            require('./FightHistory'),
            require('../config/FightSettings'),
            require('./Opponent'),
            require('./Person'),
            require('../view/Scoreboard'),
            require('../service/FightEmitter'),
            require('../service/FightReceiver'),
            require('./Playlist'),
            require('../view/Repertoire'),
            require('../util/Utils')
        )
    } else {
        root.Direzione = factory(
            root.Direzione.Fight,
            root.Direzione.FightHistory,
            root.Direzione.FightSettings,
            root.Direzione.Opponent,
            root.Direzione.Person,
            root.Direzione.Scoreboard,
            root.Direzione.FightEmitter,
            root.Direzione.FightReceiver,
            root.Direzione.Playlist,
            root.Direzione.Repertoire,
            root.Direzione.Utils
        )
    }
}(this, function (
    Fight,
    FightHistory,
    FightSettings,
    Opponent,
    Person,
    Scoreboard,
    FightEmitter,
    FightReceiver,
    Playlist,
    Repertoire,
    Utils
) {
    // Module-API
    return {
        Fight:         Fight,
        FightHistory:  FightHistory,
        FightSettings: FightSettings,
        Opponent:      Opponent,
        Person:        Person,
        Scoreboard:    Scoreboard,
        FightEmitter:  FightEmitter,
        FightReceiver: FightReceiver,
        Playlist:      Playlist,
        Repertoire:    Repertoire,
        Utils:         Utils
    }
}))
;
/**
 * A library of components that can be used to manage a martial arts tournament
 *
 * Copyright (C) 2024 Daniel Moritz
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
/** @namespace "Direzione.LocalBroker" */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('direzione-lib/service/LocalBroker',factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory()
    } else {
        root.Direzione = root.Direzione || {}
        root.Direzione.LocalBroker = factory()
    }
}(this, function () {

    /**
     * @class
     * @hideconstructor
     * @global
     * @private
     */
    function LocalBroker(peer) {
        this[' localPeer']  = peer

        localStorage.a = localStorage.b = JSON.stringify([]);
        this[' idx']   = 0;
        this[' intv']  = setInterval(function () {
            if (!this[' in']) {
                if (!JSON.parse(localStorage.a).length) return

                this[' in']  = 'a'
                this[' out'] = 'b'
            }

            var arr = JSON.parse(localStorage[this[' in']])

            if (arr.length <= this[' idx']) return
            this.onmessage && this.onmessage({ data: arr[this[' idx']] });
            this[' idx']++;
        }.bind(this), 20);
        setTimeout(function () { this.onopen && this.onopen({}) }.bind(this))
    }

    LocalBroker.prototype = {
        send: function(msg) {
            if (!this[' out']) {
                this[' out'] = 'a'
                this[' in']  = 'b'
            }
            var arr = JSON.parse(localStorage[this[' out']])

            arr.push(msg)
            localStorage[this[' out']] = JSON.stringify(arr)
        },
        onmessage: function (e) {
            var msg = e.data

            msg.sdp && this[' localPeer'].setRemoteDescription(new RTCSessionDescription(msg.sdp)).then(function () {
                     this[' localPeer'].signalingState == 'stable'
                     || this[' localPeer'].createAnswer()
                        .then(function (answer) { return this[' localPeer'].setLocalDescription(answer) }.bind(this))
                        .then(function () { this.send({ sdp: this[' localPeer'].localDescription }) }.bind(this))
                }.bind(this))
            || msg.candidate && this[' localPeer'].addIceCandidate(new RTCIceCandidate(msg.candidate))
        },
        close: function() {
            clearInterval(this[' intv'])
            localStorage.a = localStorage.b = JSON.stringify([]);
        }
    }

    // Module-API
    return {
        /**
         * Realizes a broker between two peers over the local storage
         *
         * @static
         * @method   create
         * @memberof "Direzione.LocalBroker"
         * @returns  {LocalBroker}
         */
        create: function (peer) {
            return new LocalBroker(peer)
        }
    }
}))
;
/**
 * A library of components that can be used to manage a martial arts tournament
 *
 * Copyright (C) 2024 Daniel Moritz
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
 *
 * @license GPL-3.0
 *
 * @returns {Object}
 */
/** @namespace "Direzione.FightEmitterLocal" */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('direzione-lib/service/FightEmitterLocal',['direzione-lib/service/LocalBroker'], factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./LocalBroker'))
    } else {
        root.Direzione = root.Direzione || {};
        root.Direzione.FightEmitterLocal = factory(root.Direzione.LocalBroker)
    }
}(this, function (broker) {

    /**
     * @class
     * @hideconstructor
     * @global
     * @private
     *
     * @param   {String}  receiverID
     * @param   {Fight}   fight
     *
     * @borrows <anonymous>~_connect as connect
     * @borrows <anonymous>~_registerEventListener as on
     */
    function FightEmitterLocal(receiverID, fight) {

        this[' localPeer']  = new RTCPeerConnection()
        this[' fight']      = fight
        this[' receiverID'] = receiverID
        this[' connected']  = false
        this[' conn']       = false
        this[' listener']   = {disconnect: [], establish: []}

        _initBroker.call(this)
        _registerFightHandlers.call(this)
    }
    FightEmitterLocal.prototype = {
        connect:     _connect,
        disconnect:  _disconnect,
        isConnected: function () {
            return this[' connected']
        },
        on: _registerEventListener,
        getFight: function () {
            return this[' fight']
        },
        replaceFight: function (fight) {
            this.disconnect()
            this[' fight'].clearListeners()
            delete this[' fight']
            this[' fight'] = fight
            _registerFightHandlers.call(this)
        }
    }

    /**
     * Returns whether the connection to a FightReceiver is established
     *
     * @method  FightEmitterLocal#isConnected
     * @public
     * @returns {Boolean}
     */

    /**
     * Returns the fight
     *
     * @method FightEmitterLocal#getFight
     * @public
     */

    /**
     * Replaces the fight of this emitter and emits the new object
     *
     * @method FightEmitterLocal#replaceFight
     * @public
     */

    /**
     *
     * @private
     */
    function _initBroker() {
        var b = broker.create(this[' localPeer'])
        this[' broker'] = b

        this[' localPeer'].onicecandidate      = function (e) { b.send({ candidate: e.candidate }) }
        this[' localPeer'].onnegotiationneeded = function () {
            this[' localPeer'].createOffer()
                .then(function (offer) { return this[' localPeer'].setLocalDescription(offer); }.bind(this))
                .then(function () { b.send({ sdp: this[' localPeer'].localDescription }) }.bind(this))
        }.bind(this)
    }

    /**
     * Emits fight over the connection, if established
     *
     * @private
     */
    function _emitFight() {
        var cu;
        function opponent4Emitter(side, opponent) {
            return [
                'new', side,
                opponent.getPerson().getFirstName(),
                opponent.getPerson().getLastName(),
                opponent.getPerson().getClubName(),
                opponent.getScore(),
                opponent.getShido()
            ]
        }

        _send.call(this, opponent4Emitter('white', this[' fight'].getWhiteOpponent()));
        _send.call(this, opponent4Emitter('red',   this[' fight'].getRedOpponent()));
        _send.call(this, [
            'new', 'fight', this[' fight'].getTimeLeft(),
            this[' fight'][' settings'].getCountUpLimit(),
            this[' fight'][' settings'].getCountUpLimitIppon(),
            this[' fight'][' settings'].isGripDisplayInverted(),
            this[' fight'][' settings'].isGripSideInverted()
        ]);
        if (this[' fight'].isRunning()) {
            _send.call(this, ['fight', 'startPauseResume', this[' fight'].getTimeLeft()])
        }
        if (cu = this[' fight'].getCountUp()) {
            var status = cu.isComplete() ? 4 : cu.isStopped() ? 3 : cu.isPaused() ? 2 : 1
            var side   = this[' fight'][' settings'].isGripSideInverted()
                            ? this[' fight'].invertSide(cu.side) : cu.side
            _send.call(this, ['new', 'countup', side, cu.get(), status])
        }
    }

    /**
     * Trys to disconnect from the connected FightReceiver
     *
     * @public
     * @method  FightEmitterLocal#disconnect
     */
    function _disconnect() {
        return this[' connected'] && this[' conn'].close() || true
    }

    /**
     * Trys to connect to a FightReceiver with given ID
     *
     * @public
     * @method  FightEmitterLocal#connect
     * @fires   FightEmitterLocal#establish
     * @fires   FightEmitterLocal#disconnect
     * @returns {Promise}
     */
    function _connect() {
        var deferred = {resolve: null, reject: null};
        deferred.promise = new Promise(function (resolve, reject) {
            deferred.resolve = resolve
            deferred.reject  = reject
        })

        this[' conn'] = this[' localPeer'].createDataChannel(this[' receiverID'])
        this[' conn'].onopen = function() {
            this[' connected'] = true
            _emitFight.call(this)
            this[' broker'].close()
            _dispatch.call(this, 'establish', 'peer opened')
            deferred.resolve()
        }.bind(this)
        this[' conn'].onclose = function() {
            this[' connected'] = false
            _dispatch.call(this, 'disconnect', 'peer closed')
        }.bind(this)

        return deferred.promise
    }

    /**
     * Sends data over the connection, if established
     *
     * @private
     */
    function _send(data) {
        this.isConnected() && this[' conn'].send(JSON.stringify(data))
    }

    /**
     * Registers handlers that listening on events fired by components of the fight
     *
     * @private
     */
    function _registerFightHandlers() {
        var red   = this[' fight'].getRedOpponent()
        var white = this[' fight'].getWhiteOpponent()

        this[' fight'].on('reset', function (ms) {
            _send.call(this, ['fight', 'reset', ms])
        }.bind(this))
        this[' fight'].on('startPauseResume', function (ms) {
            _send.call(this, ['fight', 'startPauseResume', ms])
        }.bind(this))
        this[' fight'].on('stop', function (data) {
            _send.call(this, ['fight', 'stop', data[0], data[1], data[2]])
        }.bind(this))
        this[' fight'].on('toketa', function (ms) {
            _send.call(this, ['fight', 'toketa', ms])
        }.bind(this))
        this[' fight'].on('osaeKomi', function (side) {
            _send.call(this, ['fight', 'osaeKomi', side])
        }.bind(this))
        this[' fight'].on('removeCountUp', function () {
            _send.call(this, ['fight', 'removeCountUp'])
        }.bind(this))

        red.on('add', function (what) {
            _send.call(this, ['red', 'add'+what])
        }.bind(this)).on('remove', function (what) {
            _send.call(this, ['red', 'remove'+what])
        }.bind(this))

        white.on('add', function (what) {
            _send.call(this, ['white', 'add'+what])
        }.bind(this)).on('remove', function (what) {
            _send.call(this, ['white', 'remove'+what])
        }.bind(this))
    }

    /**
     * Registers an event-listener to this object
     *
     * @public
     * @method  FightEmitterLocal#on
     * @param   {String} type
     * @param   {Function} callback
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

    /**
     * Will be fired when peer connection was disconnected
     * @event FightEmitterLocal#disconnect
     */

    /**
     * Will be fired when peer connection has been established
     * @event FightEmitterLocal#establish
     */

    // Module-API
    return {
        /**
         * Creates an object to emit fight events to a receiver.
         *
         * @static
         * @method   create
         * @memberof "Direzione.FightEmitterLocal"
         * @param   {String} receiverID
         * @param   {Fight}  fight
         * @returns {FightEmitterLocal}
         */
        create: function (receiverID, fight) {
            return new FightEmitterLocal(receiverID, fight)
        }
    }
}))
;
/**
 * A library of components that can be used to manage a martial arts tournament
 *
 * Copyright (C) 2024 Daniel Moritz
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
 *
 * @license GPL-3.0
 *
 * @returns {Object}
 */
/** @namespace "Direzione.FightReceiverLocal" */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('direzione-lib/service/FightReceiverLocal',[
            'direzione-lib/service/LocalBroker',
            'direzione-lib/model/Fight',
            'direzione-lib/config/FightSettings',
            'direzione-lib/model/Opponent',
            'direzione-lib/model/Person',
            'direzione-lib/view/Scoreboard'
        ], factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(
            require('./LocalBroker'),
            require('../model/Fight'),
            require('../config/FightSettings'),
            require('../model/Opponent'),
            require('../model/Person'),
            require('../view/Scoreboard')
        )
    } else {
        root.Direzione = root.Direzione || {};
        root.Direzione.FightReceiverLocal = factory(
            root.Direzione.LocalBroker,
            root.Direzione.Fight,
            root.Direzione.FightSettings,
            root.Direzione.Opponent,
            root.Direzione.Person,
            root.Direzione.Scoreboard
        )
    }
}(this, function (broker, Fight, FightSettings, Opponent, Person, Scoreboard) {

    /**
     * @class
     * @hideconstructor
     * @global
     * @private
     *
     * @param   {String} receiverID
     * @param   {Object} viewConfig
     *
     * @borrows <anonymous>~_registerEventListener as on
     */
    function FightReceiverLocal(receiverID, viewConfig) {

        this[' localPeer']     = new RTCPeerConnection()
        this[' receiverID']    = receiverID
        this[' connected']     = false
        this[' conn']          = false
        this[' viewConfig']    = viewConfig
        this[' listener']      = {disconnect: [], establish: []}
        this[' redOpponent']   = null
        this[' whiteOpponent'] = null
        this[' fight']         = null
        this[' board']         = null

        _initBroker.call(this)
        _listen.call(this)
    }
    FightReceiverLocal.prototype = {
        isConnected: function () {
            return this[' connected']
        },
        on: _registerEventListener
    }

    /**
     * Returns whether the connection to a FightReceiver is established
     *
     * @method  FightReceiverLocal#isConnected
     * @public
     * @returns {Boolean}
     */


    /**
     *
     * @private
     */
    function _initBroker() {
        var b = broker.create(this[' localPeer'])
        this[' broker'] = b

        this[' localPeer'].onicecandidate      = function (e) { b.send({ candidate: e.candidate }) }
        this[' localPeer'].onnegotiationneeded = function () {
            this[' localPeer'].createOffer()
                .then(function (offer) { return this[' localPeer'].setLocalDescription(offer); }.bind(this))
                .then(function () { b.send({ sdp: this[' localPeer'].localDescription }) }.bind(this))
        }.bind(this)
    }

    /**
     * Handles data coming from FightEmitter
     *
     * @private
     * @param {String} type
     * @param {*} data
     */
    function _onData(data) {
        if (data[0] === 'new') {
            switch (data[1]) {
                case 'red':   return this[' redOpponent']   =
                    Opponent.create(Person.create(data[2], data[3], data[4]), data[5], data[6])
                case 'white': return this[' whiteOpponent'] =
                    Opponent.create(Person.create(data[2], data[3], data[4]), data[5], data[6])
                case 'fight':
                    var settings = FightSettings.create()
                    settings
                        .setDuration(data[2])
                        .setCountUpLimit(data[3])
                        .setCountUpLimitIppon(data[4])
                        .setGripDisplayInverted(data[5])
                        .setGripSideInverted(data[6])
                    this[' fight'] = Fight.create(settings, this[' whiteOpponent'], this[' redOpponent'], true)
                    this[' board'] = Scoreboard.create(this[' fight'], this[' viewConfig'])
                return
                case 'countup':
                    this[' fight'].osaeKomi(data[2], data[3])
                    if ([4, 3, 2].indexOf(data[4]) !== -1) return this[' fight'].toketa(data[3])
                return
            }
        }

        switch (data[0]) {
            case 'fight': return this[' fight'][data[1]](
                (3 <= data.length ? data[2] : undefined),
                (4 <= data.length ? data[3] : undefined),
                (5 <= data.length ? data[4] : undefined)
            )
            case 'red':   return this[' redOpponent'][data[1]]()
            case 'white': return this[' whiteOpponent'][data[1]]()
        }
    }

    /**
     * Listens to the connection expected from FightEmitter
     *
     * @private
     * @fires   FightReceiverLocal#establish
     * @fires   FightReceiverLocal#disconnect
     * @param   {String} type
     * @param   {*} data
     */
    function _listen() {

        this[' localPeer'].ondatachannel = function (e) {
            this[' conn'] = e.channel;
            this[' conn'].onmessage = function (e) {
                _onData.call(this, JSON.parse(e.data))
            }.bind(this)
            this[' conn'].onopen = function() {
                this[' connected'] = true
                this[' broker'].close()
                _dispatch.call(this, 'establish', 'peer opened')
            }.bind(this)
            this[' conn'].onclose = function() {
                this[' connected'] = false
                this[' board'].shutdown()
                _dispatch.call(this, 'disconnect', 'peer closed')
            }.bind(this)
        }.bind(this)
    }

    /**
     * Will be fired when peer connection was disconnected
     * @event FightReceiverLocal#disconnect
     */

    /**
     * Will be fired when peer connection has been established
     * @event FightReceiverLocal#establish
     */

    /**
     * Registers an event-listener to this object
     *
     * @public
     * @method  FightReceiverLocal#on
     * @param   {String} type
     * @param   {Function} callback
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
        /**
         * Creates an object to receive scoreboard events from a emitter scoreboard.
         *
         * @static
         * @method   create
         * @memberof "Direzione.FightReceiverLocal"
         * @param   {String} receiverID
         * @param   {Object} viewConfig
         * @returns {FightReceiverLocal}
         */
        create: function (receiverID, viewConfig) {
            return new FightReceiverLocal(receiverID, viewConfig)
        }
    }
}))
;
if (typeof define === 'function' && define.amd) {
    define(['direzione-lib/model/Tournament'], function (Tournament) { return Tournament; });
}
