    export interface Qano {
        qano: number;
    }

    export interface Marcas {
        cmarca: number;
        xmarca: string
    }

    export interface Modelo {
        cmodelo: number;
        xmodelo: string;
    }
    
    export interface Version {
        cversion: number;
        xversion: string;
    }

    export const qanos: Qano[] = [];

    for (let year = 1956; year <= 2025; year++) {
        qanos.push({ qano: year });
    }

    
