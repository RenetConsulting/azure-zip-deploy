# Usage
```
    - name: Publish WebJob
      uses: srijken/azure-webjob-deploy@master
      with: 
        zip-file: webjob.zip
        publish-profile: ${{ secrets.azureWebAppPublishProfile }} 
```

## Documentation on Zip Deploy
See https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file-or-url