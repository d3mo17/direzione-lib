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
        define(['durata/dist/durata.min'], factory)
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
        },
        isInstance: function (obj) {
            return obj instanceof Person
        }
    }
}))
