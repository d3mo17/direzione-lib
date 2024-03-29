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
 *
 * @license GPL-3.0
 *
 * @returns {Object}
 */
/** @namespace "Direzione.FightReceiverLocal" */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'direzione-lib/service/LocalBroker',
            'direzione-lib/model/Fight',
            'direzione-lib/config/FightSettings',
            'direzione-lib/model/Opponent',
            'direzione-lib/model/Person',
            'direzione-lib/view/Scoreboard'
        ], factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(
            require('./LocalBroker'),
            require('../model/Fight'),
            require('../config/FightSettings'),
            require('../model/Opponent'),
            require('../model/Person'),
            require('../view/Scoreboard')
        )
    } else {
        root.Direzione = root.Direzione || {};
        root.Direzione.FightReceiverLocal = factory(
            root.Direzione.LocalBroker,
            root.Direzione.Fight,
            root.Direzione.FightSettings,
            root.Direzione.Opponent,
            root.Direzione.Person,
            root.Direzione.Scoreboard
        )
    }
}(this, function (broker, Fight, FightSettings, Opponent, Person, Scoreboard) {

    /**
     * @class
     * @hideconstructor
     * @global
     * @private
     *
     * @param   {String} receiverID
     * @param   {Object} viewConfig
     *
     * @borrows <anonymous>~_registerEventListener as on
     */
    function FightReceiverLocal(receiverID, viewConfig) {

        this[' localPeer']     = new RTCPeerConnection()
        this[' receiverID']    = receiverID
        this[' connected']     = false
        this[' conn']          = false
        this[' viewConfig']    = viewConfig
        this[' listener']      = {disconnect: [], establish: []}
        this[' redOpponent']   = null
        this[' whiteOpponent'] = null
        this[' fight']         = null
        this[' board']         = null

        this[' initValMemCountdown'] = viewConfig.outputElemCountdown.innerText

        _initBroker.call(this)
        _listen.call(this)
    }
    FightReceiverLocal.prototype = {
        isConnected: function () {
            return this[' connected']
        },
        on: _registerEventListener
    }

    /**
     * Returns whether the connection to a FightReceiver is established
     *
     * @method  FightReceiverLocal#isConnected
     * @public
     * @returns {Boolean}
     */


    /**
     *
     * @private
     */
    function _initBroker() {
        var b = broker.create(this[' localPeer'])
        this[' broker'] = b

        this[' localPeer'].onicecandidate      = function (e) { b.send({ candidate: e.candidate }) }
        this[' localPeer'].onnegotiationneeded = function () {
            this[' localPeer'].createOffer()
                .then(function (offer) { return this[' localPeer'].setLocalDescription(offer); }.bind(this))
                .then(function () { b.send({ sdp: this[' localPeer'].localDescription }) }.bind(this))
        }.bind(this)
    }

    /**
     * Handles data coming from FightEmitter
     *
     * @private
     * @param {String} type
     * @param {*} data
     */
    function _onData(data) {
        if (data[0] === 'new') {
            switch (data[1]) {
                case 'red':   return this[' redOpponent']   =
                    Opponent.create(Person.create(data[2], data[3], data[4]), data[5], data[6])
                case 'white': return this[' whiteOpponent'] =
                    Opponent.create(Person.create(data[2], data[3], data[4]), data[5], data[6])
                case 'fight':
                    var settings = FightSettings.create()
                    settings
                        .setDuration(data[2])
                        .setCountUpLimit(data[3])
                        .setCountUpLimitIppon(data[4])
                        .setGripDisplayInverted(data[5])
                        .setGripSideInverted(data[6])
                    this[' viewConfig'].outputElemCountdown.innerText = this[' initValMemCountdown']
                    this[' fight'] = Fight.create(settings, this[' whiteOpponent'], this[' redOpponent'], true)
                    this[' board'] = Scoreboard.create(this[' fight'], this[' viewConfig'])
                return
                case 'countup':
                    this[' fight'].osaeKomi(data[2], data[3])
                    if ([4, 3, 2].indexOf(data[4]) !== -1) return this[' fight'].toketa(data[3])
                return
            }
        }

        switch (data[0]) {
            case 'fight': return this[' fight'][data[1]](
                (3 <= data.length ? data[2] : undefined),
                (4 <= data.length ? data[3] : undefined),
                (5 <= data.length ? data[4] : undefined)
            )
            case 'red':   return this[' redOpponent'][data[1]]()
            case 'white': return this[' whiteOpponent'][data[1]]()
        }
    }

    /**
     * Listens to the connection expected from FightEmitter
     *
     * @private
     * @fires   FightReceiverLocal#establish
     * @fires   FightReceiverLocal#disconnect
     * @param   {String} type
     * @param   {*} data
     */
    function _listen() {

        this[' localPeer'].ondatachannel = function (e) {
            this[' conn'] = e.channel;
            this[' conn'].onmessage = function (e) {
                _onData.call(this, JSON.parse(e.data))
            }.bind(this)
            this[' conn'].onopen = function() {
                this[' connected'] = true
                this[' broker'].close()
                _dispatch.call(this, 'establish', 'peer opened')
            }.bind(this)
            this[' conn'].onclose = function() {
                this[' connected'] = false
                this[' board'].shutdown()
                _dispatch.call(this, 'disconnect', 'peer closed')
            }.bind(this)
        }.bind(this)
    }

    /**
     * Will be fired when peer connection was disconnected
     * @event FightReceiverLocal#disconnect
     */

    /**
     * Will be fired when peer connection has been established
     * @event FightReceiverLocal#establish
     */

    /**
     * Registers an event-listener to this object
     *
     * @public
     * @method  FightReceiverLocal#on
     * @param   {String} type
     * @param   {Function} callback
     */
    function _registerEventListener(type, callback) {
        var eventTypes = Object.keys(this[' listener'])
        if (eventTypes.indexOf(type) === -1) {
            throw new RangeError(
                'Only following values are allowed for event type: ' + eventTypes.join(', ') + '!'
            )
        }

        this[' listener'][type].push(callback)

        return this
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

    // Module-API
    return {
        /**
         * Creates an object to receive scoreboard events from a emitter scoreboard.
         *
         * @static
         * @method   create
         * @memberof "Direzione.FightReceiverLocal"
         * @param   {String} receiverID
         * @param   {Object} viewConfig
         * @returns {FightReceiverLocal}
         */
        create: function (receiverID, viewConfig) {
            return new FightReceiverLocal(receiverID, viewConfig)
        }
    }
}))
