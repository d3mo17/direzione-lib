
const Playlist = require('../../src/model/Playlist')

describe('model/Playlist.js', () => {
    it('insert entries', () => {
        var pl = Playlist.create()

        pl.insert('b')
        pl.insert(5)
        pl.insert('c')

        pl.reset()

        expect(pl.getLength()).toEqual(3)
        expect(pl.next()).toEqual('b')
        expect(pl.next()).toEqual(5)
    })

    it('remove entry', () => {
        var pl = Playlist.create()

        pl.insert('b')
        pl.insert(5)
        pl.insert('c')

        pl.remove('c')
        pl.reset()

        expect(pl.getLength()).toEqual(2)
        expect(pl.next()).toEqual('b')
        expect(pl.next()).toEqual(5)
    })

    it('includes entry', () => {
        var pl = Playlist.create()

        pl.insert('b')
        pl.insert(5)
        pl.insert('c')

        expect(pl.includes(5)).toBe(true)
        expect(pl.includes('d')).toBe(false)
    })

    it('insert entries after empty', () => {
        var pl = Playlist.create()

        pl.insert('b')
        pl.insert(5)
        pl.insert('c')

        pl.empty()

        pl.insert('z')
        pl.insert('x')

        pl.reset()

        expect(pl.getLength()).toEqual(2)
        expect(pl.next()).toEqual('z')
        expect(pl.next()).toEqual('x')
    })
})
