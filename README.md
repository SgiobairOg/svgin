# SVGin

Takes an SVG element and merges all paths into a single path element. Currently other SVG elements such as `rect` and `text` are left as-is.

## Usage

### Curl

```bash
npm install
npm run start

curl --noproxy localhost -H 'Content-type: text/xml' -d @test.xml -X POST http://localhost:3080/v1/gin
```

The `--noproxy` flag and host value are only necessary when behind a proxy.

The `test.xml` is included but you can point the script toward any XML file.