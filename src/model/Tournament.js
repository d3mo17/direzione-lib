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
