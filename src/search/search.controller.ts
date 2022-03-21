import { Controller, Get } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Script } from "@elastic/elasticsearch/lib/api/types";
const { Client } = require('@elastic/elasticsearch')
const client = new Client({
  node: 'https://elasticsearch:9200',
  auth: {
    username: 'elastic',
    password: '123abc'
  },
  // tls: {
  //   // ca: fs.readFileSync('./cacert.pem'),
  //   rejectUnauthorized: false
  // }
})
debugger
@Controller('search')
export class SearchController {

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  @Get('/ping')
  async run() {
    // Let's start by indexing some data
    await client.index({
      index: 'game-of-thrones2',
      document: {
        character: 'Ned Stark',
        quote: 'Winter is coming.'
      }
    })

    await client.index({
      index: 'game-of-thrones2',
      document: {
        character: 'Daenerys Targaryen',
        quote: 'I am the blood of the dragon.'
      }
    })

    await client.index({
      index: 'game-of-thrones2',
      document: {
        character: 'Tyrion Lannister',
        quote: 'A mind needs books like a sword needs a whetstone.'
      }
    })

    // here we are forcing an index refresh, otherwise we will not
    // get any result in the consequent search
    await client.indices.refresh({ index: 'game-of-thrones2' })

    // Let's search!
    const result= await client.search({
      index: 'game-of-thrones2',
      query: {
        match: { quote: 'winter' }
      }
    })

    console.log(result.hits.hits)
  }

  @Get('create')
  async create() {
    await this.elasticsearchService.index(
      {
        index: 'game-of-thrones2',
        document: {
          character: 'Ned Stark',
          quote: 'Winter is coming.'
        }
      }
    )

    const result = await this.elasticsearchService.search({
      index: 'game-of-thrones2',
      query: {
        match: { quote: 'winter' }
      }
    })

    console.log(result.hits.hits)
  }

  @Get('delete')
  async destroy() {
    await this.elasticsearchService.deleteByQuery({
      index: 'game-of-thrones2',
      body: {
        query: {
          match: { quote: 'winter' }
        }
      }
    })

    const result = await this.elasticsearchService.search({
      index: 'game-of-thrones2',
      query: {
        match: { quote: 'winter' }
      }
    })

    console.log(result.hits.hits)
  }


  @Get('update')
  async update() {
    const newBody = {
      id: 1,
      title: 1,
      content: 1,
      authorId: 1,
      character: 'Ned Stark',
      quote: 'Winter is coming.'
    }

    const script: Script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, '')

    // console.log({ script })

    // @ts-ignore
    await this.elasticsearchService.updateByQuery({
      index: 'game-of-thrones2',
      body: {
        query: {
          match: { quote: 'winter' }
        }
      },
      script: {
        // @ts-ignore
        inline: script
      }
    })

    const result = await this.elasticsearchService.search({
      index: 'game-of-thrones2',
      query: {
        match: { quote: 'winter' }
      }
    })

    console.log(result.hits.hits)
    return 123
  }
}
