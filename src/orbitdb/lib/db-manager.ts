import OrbitDB from 'orbit-db';

export class DbManager {
    constructor(private orbitdb: OrbitDB) {}

    getOrbitDb(): OrbitDB {
        return this.orbitdb;
    }
}
