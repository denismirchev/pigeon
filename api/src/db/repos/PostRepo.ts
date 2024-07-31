import { db } from '@src/db/setup';
import {IPost, posts} from '@src/db/models/Post';

class PostRepo {
  private db;

  public constructor() {
    this.db = db;
  }

  public async create(post: IPost) {
    await this.db.insert(posts).values(post);
  }
}

export default new PostRepo();