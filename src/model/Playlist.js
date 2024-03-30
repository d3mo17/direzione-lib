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
        define(factory)
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
        empty:     _empty,
        find:      _find,
        insert:    _insert,
        includes:  _includes,
        next:      _next,
        prev:      _prev,
        reset:     _reset,
        remove:    _remove,
        getLength: function () { return this[' length'] }
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
     * Empty paylist
     *
     * @method Playlist#empty
     * @return {Playlist} - Returns the Playlist instance which this method is called
     * @public
     */
    function _empty() {
        var fight

        _reset.call(this)
        while (fight = _next.call(this)) {
            _remove.call(this, fight)
        }

        return _reset.call(this)
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
