import Redis from "ioredis";
let config = {};

if (process.env.NODE_ENV === "production") {
  config = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  };
}

const redis = new Redis({ ...config, lazyConnect: true });

Redis.Command.setReplyTransformer("get", (res) => {
  return JSON.parse(res);
});

const keys = {
  diagnoses: "diagnoses",
  patient: (patientId: string) => `patient:${patientId}`,
  patients: "patients",
  entry: (entryId: string) => `entry:${entryId}`,
  entries: (patientId: string) => `entries:${patientId}`,
};

const mapPipeRes = (
  pipeRes: Array<[Error | null, any]>,
  transformer?: (val: any) => any
) => {
  const results = [];
  for (const [err, res] of pipeRes) {
    if (err) throw new Error("Error fetching query");
    results.push(transformer ? transformer(res) : res);
  }
  return results.filter(Boolean);
};

const pushTrim = (key: string, val: string, nItems: number) => {
  const trans = redis.multi();
  return trans.lpush(key, val).ltrim(key, 0, nItems - 1);
};

export { redis as default, keys, mapPipeRes, pushTrim };
