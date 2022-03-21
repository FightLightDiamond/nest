import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PostEntity } from '../models/post.entity';
import IPostSearchResult from '../types/postSearchResult.interface';
import IPostSearchBody from '../types/postSearchBody.interface';

import { Client } from '@elastic/elasticsearch';
const client = new Client({ node: 'http://localhost:9200' });

@Injectable()
export default class PostsSearchService {
  index = 'posts';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  /**
   * index Post
   * @param post
   */
  async indexPost(post: PostEntity) {
    return await this.elasticsearchService.index({
      index: this.index,
      body: {
        id: post.id,
        title: post.body,
      },
    });
  }

  /**
   * search
   * @param text
   */
  async search(text: string) {
    const res = await this.elasticsearchService.search({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['body'],
          },
        },
      },
    });

    console.log({ res });
    // const hits = res?.body.hits.hits;
    // return hits.map((item) => item._source);
  }

  /**
   * remove
   * @param postId
   */
  async remove(postId: number) {
    await this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: postId,
          },
        },
      },
    });
  }

  async update(post: PostEntity) {
    const newBody = {
      id: post.id,
      body: post.body,
    };

    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, '');

    return this.elasticsearchService.updateByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: post.id,
          },
        },
        script: {
          // @ts-ignore
          inline: script,
        },
      },
    });
  }
}
