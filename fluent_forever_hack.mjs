// import  "zx/globals";
const uniqBy = (arr, predicate) => {
  const cb = typeof predicate === "function" ? predicate : (o) => o[predicate];

  return [
    ...arr
      .reduce((map, item) => {
        const key = item === null || item === undefined ? item : cb(item);

        map.has(key) || map.set(key, item);

        return map;
      }, new Map())
      .values(),
  ];
};

const FETCH_FROM_WEB = false;
if (FETCH_FROM_WEB) {
  const fromWeb = await fetch(
    "https://api.fluent-forever.app/v1/en-US_es-MX/ugc/sentences?local_time=2022-03-19T16%3A05%3A06.784-05%3A00",
    {
      method: "GET",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJqbEVNamN5TUVJM09EVXlPREpDUVVWQk56a3dOamd3UXpkRVFqVkJNVVpHTmpoRE5qQXdOdyJ9.eyJodHRwczovL2FwcC5mbHVlbnQtZm9yZXZlci5jb20vdXNlcl9pbmZvIjp7ImNyZWF0ZWRfYXQiOiIyMDIyLTAzLTA4VDE0OjUzOjM4LjI4NVoiLCJlbWFpbCI6ImxhcnNrYXJibytzcGFuaXNoQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmZl9zdWJzY3JpcHRpb25faWQiOiIiLCJmZl91c2VyX2lkIjoiY2FhZWE5NWItYzZlMS00ZmVhLTgwMzktNzgxOGU0OGVjYWNiIiwiZmlyc3ROYW1lIjoiTGFycyIsImlkZW50aXR5X3Byb3ZpZGVyIjoiYXV0aDAiLCJsYXN0TmFtZSI6IkthcmJvIiwibmV3c2xldHRlciI6ImZhbHNlIn0sImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZmx1ZW50LWZvcmV2ZXIuYXBwLyIsInN1YiI6ImF1dGgwfDYyMjc2ZGYyZjMyOGU1MDA3MDg1MzVlZiIsImF1ZCI6WyJodHRwczovL2ZsdWVudC1mb3JldmVyLmNvbS9hcGkvIiwiaHR0cHM6Ly9mbHVlbnRmb3JldmVyLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2NDgxNzM1MDAsImV4cCI6MTY0ODI1OTkwMCwiYXpwIjoiUEswMmdxN2NnRHNGSWV4M0VESkhHb2JEWmhPWTRPM1kiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIG9mZmxpbmVfYWNjZXNzIn0.pcd5dYyu8mCIu7SutHvbcohYXr8EtRcZ2x0UoMl6nKvI9I-1s_E2oUpJTlAqLKl7Qw58t00P6awP7hoNtd9b0xZNg2zIu-hIBoySjBjKpBD8NzlXV3YUQaxocak60WIuXzYkk61AqM62xX7egpK_44YQDGg21o24VCUur-_5mUMzoM1kP0qn09Tl7yDtaQtM9WDhx5UW_JFoBFfR3t7L4OfK3vNcnIYnpkgxLfB5miXywA4OxUkB7wmGEqukXvRcgjcBBiqhzGQCl49dA9hxwVgcoTv_G81Kpvm_DeQg2b8LZdm4_-eFhfy3vHyNwi_6_rEWZWHj7Du_b7BC2Yy9fQ",
        "User-Agent": "Fluent/1.0.59 (ios; build:1173; codePushLabel:v44",
        
      },
    }
  ).then((res) => res.json());

  if (!fromWeb.data) {
    console.log("fromWeb: ", fromWeb);
    exit(1);
  }

  await fs.writeJson("fluent_forever_hack.json", fromWeb);
}
const res = await fs.readJson("fluent_forever_hack.json");

let currentDay = 0;
uniqBy(
  res.data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
  "learn_txt"
).forEach((element) => {
  const day = new Date(element.created_at).toDateString();
  if (day !== currentDay) {
    currentDay = day;
    console.log(" ");
    console.log(chalk.yellow("--"));
    console.log(chalk.yellow("day: ", day, "👇"));
    console.log(" ");
  }

  console.log(element.learn_txt, chalk.yellow(element.audio_url) + "");
  // console.log(chalk.gray(element.known_txt))
});

console.log(" ");
console.log(chalk.yellow("--"));
console.log(" ");
console.log(" ");
console.log(chalk.yellow("--"));
console.log(" ");

const data = {
  audio_url:
    "https://cdn.sanity.io/files/fd4h01fn/production/e1f84101e839dac5e25e4200784086a5a7c9e673.mp3",
  created_at: "2022-03-17T18:59:12+00:00",
  flashcardsCount: 0,
  id: "644f059c-1e7b-4037-9986-ebcbc1c1a2ac",
  is_special_word_sentence: false,
  is_ugc: true,
  known_txt: " You wanted something else.",
  known_word_txt: "something",
  learn_txt: "Tu quisiste otra cosa.",
  learn_word_txt: "cosa",
  sentence_type: "user_generated",
  sentence_words: [
    {
      abstract: false,
      child_index: 0,
      id: "ca2cbb4d-4cfe-4918-b9dd-d376c746fdfd",
      known_txt: "",
      known_word_id: "",
      learn_txt: "Tu",
      learn_word_id: "",
      post_learn_txt: " ",
      pre_learn_txt: "",
      root_txt: "Tu",
      root_word_id: "ca2cbb4d-4cfe-4918-b9dd-d376c746fdfd",
      sentence_order: 0,
      tags: [],
      vulgar: false,
    },
    {
      abstract: false,
      child_index: 1,
      id: "bd532947-f96f-4ef3-a2a2-4b251bd9bdbd",
      known_txt: "",
      known_word_id: "",
      learn_txt: "quisiste",
      learn_word_id: "",
      post_learn_txt: " ",
      pre_learn_txt: "",
      root_txt: "quisiste",
      root_word_id: "bd532947-f96f-4ef3-a2a2-4b251bd9bdbd",
      sentence_order: 1,
      tags: [],
      vulgar: false,
    },
    {
      abstract: false,
      child_index: 2,
      id: "b0f74868-b731-4858-ae29-2daaf50bd107",
      known_txt: "",
      known_word_id: "",
      learn_txt: "otra",
      learn_word_id: "",
      post_learn_txt: " ",
      pre_learn_txt: "",
      root_txt: "otra",
      root_word_id: "b0f74868-b731-4858-ae29-2daaf50bd107",
      sentence_order: 2,
      tags: [],
      vulgar: false,
    },
    {
      abstract: false,
      child_index: 3,
      id: "e834c6b7-c484-4c90-adef-5251e661b0b1",
      known_txt: "something",
      known_word_id: "",
      learn_txt: "cosa",
      learn_word_id: "",
      post_learn_txt: ".",
      pre_learn_txt: "",
      root_txt: "cosa",
      root_word_id: "e834c6b7-c484-4c90-adef-5251e661b0b1",
      sentence_order: 3,
      tags: [],
      vulgar: false,
    },
  ],
  vulgar: false,
};

fs.writeJson("fluent_forever_hack.json", res);
