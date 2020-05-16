# webhook-action

GitHub Action that sends a POST request. Useful for triggering a webhook for CI/CD.

## Inputs

### `url`

**Required**: URL of webhook to send post request to.

### `data`

Optional: JSON string of data to pass into request. Default `"{}"`.


## Example usage

```yaml
uses: muinmomin/webhook-action@v1.0.0
with:
  url: ${{ secrets.WEBHOOK_URL }}
  data: "{'command': 'publish'}"
```


## Contributing

Feel free to open issues or submit PRs.
