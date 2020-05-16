# webhook-action

Github action to invoke a POST webhook

## Example usage

```yaml
uses: verdaccio/github-actions/webhook@master
with:
  url: ${{ secrets.SECRET_ID }}
  releae: 'release-id'
```
