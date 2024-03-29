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
            root.Direzione.RoundRobinTournamentIterator
        )
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
    RoundRobinTournamentIterator
) {
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
        RoundRobinTournamentIterator: RoundRobinTournamentIterator
    }
}))
