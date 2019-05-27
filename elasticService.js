const elasticsearch = require('elasticsearch');

class ElasticService {
    constructor(config, logger) {
        this.config = config;
        this.logger = logger;

        this.logger.info(`Starting elastic client with config: ${JSON.stringify(config)}`);
        const elasticConfig = Object.assign({}, config);
        this.client = new elasticsearch.Client(elasticConfig);
    }

    async createDocument(index, data) {
        this.logger.info('Creating document');
        const result = await this.client.index({
            index: index,
            type: '_doc',
            body: data,
            id: data.Id,
        });

        this.logger.info('Elastic request sucessful.');
        return result;
    }

    async bulkInsert(data) {
        const result = await this.client.bulk({
            body: data
        });

        return result;
    }

    async deleteDocument(index, id) {
        this.logger.info('Deleting document');

        const result = await this.client.deleteByQuery({
            index: index,
            body: {
                query: {
                    bool: {
                        filter: [
                            {
                                term: { _id: id }
                            }
                        ]
                    }
                }
            }
        });

        this.logger.info('Elastic request sucessful.');
        return resolve(result);
    }
}

module.exports = ElasticService;