import {Injectable, StreamableFile} from "@nestjs/common";
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class ImageService {

    async getImage(path: string): Promise<StreamableFile> {
        const image = createReadStream(join(process.cwd(), 'src', path));
        return new StreamableFile(image);
    }
}