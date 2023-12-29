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
        define(factory)
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
