interface IDatabaseError {
  code: string;
  errno: number;
  sql: string;
  sqlState: string;
  sqlMessage: string;
}

function isDatabaseError(err: unknown): err is IDatabaseError {
  return typeof err === 'object' && err !== null && 'sql' in err;
}

function extractFieldFromSqlMessage(sqlMessage: string): string {
  const match = sqlMessage.match(/key '(\w+)_(\w+)_(.+?)'/);
  return match ? match[2] : '';
}

function extractEntryFromSqlMessage(sqlMessage: string): string {
  const match = sqlMessage.match(/entry '(.+?)'/);
  return match ? match[1] : '';
}

export {
  isDatabaseError,
  extractFieldFromSqlMessage,
  extractEntryFromSqlMessage,
};