const fs = require("fs");
const path = require("path");

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, "city.list.min.json"))
).map((val) => ({
  name:
    val.state.length > 0
      ? `${val.name}, ${val.state}, ${val.country}`
      : `${val.name}, ${val.country}`,
  id: val.id,
}));

module.exports = async function (context, req) {
  const q = req.query.q;
  if (q && q.length > 0) {
    const filter = data.filter((val) => {
      return val.name.toLowerCase().includes(q.toLowerCase());
    });
    const body = filter.sort((a, b) => a.name.localeCompare(b.name));
    if (body.length <= 5000) {
      context.res = {
        body,
      };
    } else {
      context.res = {
        status: 403,
        body: { contentLength: body.length },
      };
    }
  } else {
    context.res = {
      status: 403,
    };
  }
};
