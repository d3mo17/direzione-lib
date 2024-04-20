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
 */
var fs = require('fs'),
    rjs = require('requirejs'),
    UglifyJS = require('uglify-js');

rjs.optimize({
    optimize: 'none',

    baseUrl: 'src',
    paths: {
      'uuid-random': '../node_modules/uuid-random',
      'direzione-lib': '.',
      'durata': 'empty:',
      'peerjs': 'empty:'
    },
    include: [
      'uuid-random/index',
      'direzione-lib/config/FightSettings',
      'direzione-lib/model/Fight',
      'direzione-lib/model/FightHistory',
      'direzione-lib/model/Opponent',
      'direzione-lib/model/OpponentGroup',
      'direzione-lib/model/Person',
      'direzione-lib/model/Playlist',
      'direzione-lib/model/Tournament',
      'direzione-lib/service/FightEmitter',
      'direzione-lib/service/FightReceiver',
      'direzione-lib/service/LocalBroker',
      'direzione-lib/service/FightEmitterLocal',
      'direzione-lib/service/FightReceiverLocal',
      'direzione-lib/util/RingIterator',
      'direzione-lib/util/RoundRobinTournamentIterator',
      'direzione-lib/util/Utils',
      'direzione-lib/view/Repertoire',
      'direzione-lib/view/Scoreboard'
    ],
    out: function (text, sourceMapText) {
        var package = JSON.parse(fs.readFileSync(
            './package.json', { encoding: 'utf8', flag: 'r' }
        ));
        fs.writeFileSync('dist/direzione-lib.js', [
            '/**',
            ' * Direzione Library v' + package.version,
            ' *',
            ' * Copyright (C) 2023 Daniel Moritz',
            ' * Copyright (c) 2016-2019 Wes Roberts (for included library "uuid-random", MIT Licensed)',
            ' *',
            ' * This program is free software: you can redistribute it and/or modify',
            ' * it under the terms of the GNU General Public License as published by',
            ' * the Free Software Foundation, in version 3 of the License.',
            ' *',
            ' * This program is distributed in the hope that it will be useful,',
            ' * but WITHOUT ANY WARRANTY; without even the implied warranty of',
            ' * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the',
            ' * GNU General Public License for more details.',
            ' *',
            ' * You should have received a copy of the GNU General Public License',
            ' * along with this program.  If not, see <https://www.gnu.org/licenses/>',
            ' */', ''
        ].join("\n") + text);
        fs.writeFileSync(
            'dist/direzione-lib.min.js',
            [
                '/**',
                ' * Direzione Library v' + package.version,
                ' *',
                ' * A library of components that can be used to manage a martial arts tournament',
                ' *',
                ' * Copyright (C) 2023 Daniel Moritz',
                ' * Copyright (c) 2016-2019 Wes Roberts (for included library "uuid-random", MIT Licensed)',
                ' *',
                ' * This program is free software: you can redistribute it and/or modify',
                ' * it under the terms of the GNU General Public License as published by',
                ' * the Free Software Foundation, in version 3 of the License.',
                ' *',
                ' * This program is distributed in the hope that it will be useful,',
                ' * but WITHOUT ANY WARRANTY; without even the implied warranty of',
                ' * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the',
                ' * GNU General Public License for more details.',
                ' *',
                ' * You should have received a copy of the GNU General Public License',
                ' * along with this program.  If not, see <https://www.gnu.org/licenses/>',
                ' */'
            ].join("\n") + UglifyJS.minify(text, {compress: {sequences: false}}).code
        );
    },
    wrap: {
        end: ["if (typeof define === 'function' && define.amd) {\n",
            "    define(['direzione-lib/model/Tournament'], function (Tournament) { return Tournament; });\n",
            "}\n"
        ].join('')
    },

    preserveLicenseComments: false,
    skipModuleInsertion: true,
    findNestedDependencies: true
}, function (buildResponse) {
    console.log(buildResponse);
    resolve(buildResponse);
});
