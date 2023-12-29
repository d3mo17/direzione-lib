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
        define(factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory()
    } else {
        root.Direzione = root.Direzione || {}
        root.Direzione.Opponent = factory()
    }
}(this, function () {

    var eventTypes = ['add', 'remove', 'reset']

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
