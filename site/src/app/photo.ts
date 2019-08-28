export class Photo {
    id: number;
    guid: string;
    photoName: string;

    constructor(id: number, guid: string, photoName: string) {
        this.id = id;
        this.guid = guid;
        this.photoName = photoName;
    }
}