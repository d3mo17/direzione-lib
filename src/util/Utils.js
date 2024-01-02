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
/** @namespace "Direzione.Utils" */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory()
    } else {
        root.Direzione = root.Direzione || {}
        root.Direzione.Utils = factory()
    }
}(this, function () {

    /**
     * Loads a JS-file from a given path and passes the so (hopefully) loaded
     * member variable "Direzione.translation" to the given callback-function
     *
     * @public
     * @static
     * @method   loadTranslationJS
     * @memberof "Direzione.Utils"
     *
     * @param    {String} path
     * @param    {Function} callback
     *
     * @returns  {String}
     */
    function loadTranslationJS(path, callback) {
        var script = document.createElement('script');

        script.onload = function () {
            callback(Direzione.translation)
        };
        script.src = path;

        document.head.appendChild(script);
    }

    // Module-API
    return {
        loadTranslationJS: loadTranslationJS
    }
}))
