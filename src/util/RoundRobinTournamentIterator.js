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
/** @namespace "Direzione.RoundRobinTournamentIterator" */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['direzione-lib/util/RingIterator'], factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./RingIterator'))
    } else {
        root.Direzione = root.Direzione || {}
        root.Direzione.RoundRobinTournamentIterator = factory(root.Direzione.RingIterator)
    }
}(this, function (RingIterator) {

    function RoundRobinTournamentIterator(arr) {
        if (arr.length < 2) {
            throw new RangeError('Provide an array with at least two elements!');
        }
        if (!!(arr.length % 2)) {
            // add null value, when odd
            arr.push(null)
        }

        this[' startPos']  = 1
        this[' break']     = false
        this[' maxTurns']  = arr.length
        this[' half']      = Math.floor((arr.length - 1) / 2)
        this[' iterator']  = RingIterator.create(arr)
        this[' queue']     = []
        this[' postQueue'] = []
        this[' stack']     = []
        this[' postStack'] = []
    }
    RoundRobinTournamentIterator.prototype = {
        next: function () {
            var t, next
            var h  = this[' half']
            var it = this[' iterator']

            if (0 < this[' queue'].length) {
                this[' break'] = this[' queue'].length === 1 && it.getTurn() < this[' maxTurns'] - 1
                return [this[' stack'].pop(), this[' queue'].shift()]
            }

            if (this[' break']) {
                this[' break'] = false
                return []
            }

            for (var p = this[' startPos'];;p++) {
                next = it.next()
                t    = it.getTurn()

                if (this[' maxTurns'] <= t) {
                    return null
                }

                if (p === t) {
                    this[' satellite'] = next
                } else if (p === this[' maxTurns']) {
                    this[' stack'] = this[' stack'].concat(this[' postStack'])
                    this[' queue'] = this[' queue'].concat(this[' postQueue'])
                    this[' postStack'] = []
                    this[' postQueue'] = []

                    if (next === null) {
                        this[' break'] = this[' queue'].length === 1 && it.getTurn() < this[' maxTurns'] - 1
                        return [this[' stack'].pop(), this[' queue'].shift()]
                    }

                    return [next, this[' satellite']]
                } else if (p <= t + h && t < p) {
                    this[' queue'].push(next)
                } else if (t + h < p && p <= t + h * 2) {
                    this[' stack'].push(next)
                } else if (p < t && t - h <= p) {
                    this[' postStack'].push(next)
                } else if (p < t - h) {
                    this[' postQueue'].push(next)
                }
            }
        }
    }

    // Module-API
    return {
        /**
         * Creates an object to iterate through an array.
         *
         * @static
         * @method   create
         * @memberof "Direzione.RoundRobinTournamentIterator"
         * @param    {Array} arr
         */
        create: function (arr) {
            return new RoundRobinTournamentIterator(arr);
        },
    }
}))
