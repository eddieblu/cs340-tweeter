import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { Status } from "tweeter-shared";

export abstract class DynamoStatusPageDao {
  protected readonly docClient: DynamoDBDocumentClient;

  constructor(docClient?: DynamoDBDocumentClient) {
    this.docClient =
      docClient ?? DynamoDBDocumentClient.from(new DynamoDBClient({}));
  }

  protected async getStatusPage(
    tableName: string,
    partitionKeyName: string, // "receiver_alias" or "author_alias"
    userAlias: string,
    pageSize: number,
    lastStatus: Status | undefined,
    mapItemToStatus: (item: any) => Status
  ): Promise<{ statuses: Status[]; hasMore: boolean }> {
    const queryInput: QueryCommandInput = {
      TableName: tableName,
      KeyConditionExpression: lastStatus
        ? `${partitionKeyName} = :alias AND #ts < :lastTimestamp`
        : `${partitionKeyName} = :alias`,
      ExpressionAttributeValues: lastStatus
        ? {
            ":alias": userAlias,
            ":lastTimestamp": lastStatus.timestamp,
          }
        : {
            ":alias": userAlias,
          },
      ...(lastStatus && { ExpressionAttributeNames: { "#ts": "timestamp" } }),
      ScanIndexForward: false,
      Limit: pageSize,
    };

    const result = await this.docClient.send(new QueryCommand(queryInput));

    const statuses =
      result.Items?.map((raw) => {
        return mapItemToStatus(raw);
      }) ?? [];

    const hasMore = !!result.LastEvaluatedKey;

    return { statuses, hasMore };
  }
}
