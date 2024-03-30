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
        define(['direzione-lib/util/Utils'], factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../util/Utils'))
    } else {
        root.Direzione = root.Direzione || {}
        root.Direzione.Repertoire = factory(root.Direzione.Utils)
    }
}(this, function (Utils) {

    /**
     * @class
     * @hideconstructor
     * @global
     * @private
     *
     * @param   {Tournament} tournament
     * @param   {Object}     viewConfig
     *
     * @borrows <anonymous>~_connect as connect
     * @borrows <anonymous>~_registerEventListener as on
     */
    function Repertoire(tournament, viewConfig) {
        this[' tournament']      = tournament
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
    Repertoire.prototype = {
        refresh: function () {
            _emptyEntryWrapperElement.call(this)
            _makeListVisual.call(this)
        }
    }

    /**
     * @private
     */
    function _emptyEntryWrapperElement() {
        var nodes = this[' entryWrapper'].childNodes
        while(0 < nodes.length) {
            nodes[0].remove()
        }
    }

    /**
     * @private
     */
    function _animationLoop() {
        this[' entryWrapper'].querySelectorAll(this[' entryJig'].tagName).forEach(function (entry) {
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
        var fight, entry, pl = this[' tournament'].getPlaylist()
        pl.reset()
        while (fight = pl.next()) {
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
         * @param   {Tournament} tournament
         * @param   {Object} viewConfig
         * @returns {Repertoire}
         */
        create: function (tournament, viewConfig) {
            return new Repertoire(tournament, viewConfig)
        }
    };
}));
