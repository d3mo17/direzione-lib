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
/** @namespace "Direzione.RingIterator" */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory()
    } else {
        root.Direzione = root.Direzione || {}
        root.Direzione.RingIterator = factory()
    }
}(this, function () {

    /**
     * @param {Array} arr
     */
    function RingIterator(arr) {
        this[' arr']    = arr
        this[' values'] = arr.values()
        this[' turn']   = 1
    }
    RingIterator.prototype = {
        next: function () {
            var entry = this[' values'].next()
            if (entry.done) {
                this[' values'] = this[' arr'].values()
                this[' turn']++
                return this[' values'].next().value
            }

            return entry.value
        },
        getTurn: function () {
            return this[' turn']
        }
    }

    // Module-API
    return {
        /**
         * Creates an object to iterate through an array.
         *
         * @static
         * @method   create
         * @memberof "Direzione.RingIterator"
         * @param    {Array} arr
         */
        create: function (arr) {
            return new RingIterator(arr);
        },
    }
}))
