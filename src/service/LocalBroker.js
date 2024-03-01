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
/** @namespace "Direzione.LocalBroker" */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory()
    } else {
        root.Direzione = root.Direzione || {}
        root.Direzione.LocalBroker = factory()
    }
}(this, function () {

    /**
     * @class
     * @hideconstructor
     * @global
     * @private
     */
    function LocalBroker(peer) {
        this[' localPeer']  = peer

        localStorage.a = localStorage.b = JSON.stringify([]);
        this[' idx']   = 0;
        this[' intv']  = setInterval(function () {
            if (!this[' in']) {
                if (!JSON.parse(localStorage.a).length) return

                this[' in']  = 'a'
                this[' out'] = 'b'
            }

            var arr = JSON.parse(localStorage[this[' in']])

            if (arr.length <= this[' idx']) return
            this.onmessage && this.onmessage({ data: arr[this[' idx']] });
            this[' idx']++;
        }.bind(this), 20);
        setTimeout(function () { this.onopen && this.onopen({}) }.bind(this))
    }

    LocalBroker.prototype = {
        send: function(msg) {
            if (!this[' out']) {
                this[' out'] = 'a'
                this[' in']  = 'b'
            }
            var arr = JSON.parse(localStorage[this[' out']])

            arr.push(msg)
            localStorage[this[' out']] = JSON.stringify(arr)
        },
        onmessage: function (e) {
            var msg = e.data

            msg.sdp && this[' localPeer'].setRemoteDescription(new RTCSessionDescription(msg.sdp)).then(function () {
                     this[' localPeer'].signalingState == 'stable'
                     || this[' localPeer'].createAnswer()
                        .then(function (answer) { return this[' localPeer'].setLocalDescription(answer) }.bind(this))
                        .then(function () { this.send({ sdp: this[' localPeer'].localDescription }) }.bind(this))
                }.bind(this))
            || msg.candidate && this[' localPeer'].addIceCandidate(new RTCIceCandidate(msg.candidate))
        },
        close: function() {
            clearInterval(this[' intv'])
            localStorage.a = localStorage.b = JSON.stringify([]);
        }
    }

    // Module-API
    return {
        /**
         * Realizes a broker between two peers over the local storage
         *
         * @static
         * @method   create
         * @memberof "Direzione.LocalBroker"
         * @returns  {LocalBroker}
         */
        create: function (peer) {
            return new LocalBroker(peer)
        }
    }
}))
