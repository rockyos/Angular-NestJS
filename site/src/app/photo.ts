export class Photo {
    id: number;
    guid: string;
    originalname: string;

    constructor(id: number, guid: string, originalname: string) {
        this.id = id;
        this.guid = guid;
        this.originalname = originalname;
    }
}