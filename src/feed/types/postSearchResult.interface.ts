import IPostSearchBody from './postSearchBody.interface';

interface IPostSearchResult {
  body: {
    total: number;
    hits: Array<{
      _source: IPostSearchBody;
    }>;
  };
}

export default IPostSearchResult;
