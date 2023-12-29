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
        define(['direzione-lib/model/Playlist'], factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../model/Playlist'))
    } else {
        root.Direzione = root.Direzione || {}
        root.Direzione.Repertoire = factory(root.Direzione.Playlist)
    }
}(this, function (Playlist) {

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
        this[' playlist']     = playlistModel
        this[' entryJig']     = viewConfig.entryJigElem.cloneNode(true)
        this[' entryWrapper'] = viewConfig.entryWrapperElem

        viewConfig.entryJigElem.remove();

        this[' entryJig'].removeAttribute('id')
        _makeListVisual.call(this)
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
            entry.querySelector(".white").innerText = fight.getWhiteOpponent().getFullName()
            entry.querySelector(".red").innerText   = fight.getRedOpponent().getFullName()

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
