# Paper Finder
Find papers from specific authors on arxiv, sorted by date. Currently designed for local hosting only.

## Instructions
To run on your localhost, do the following:

1. Create a local environment
```
python3 -m venv arxivenv
source arxivenv/bin/activate
```
2. Install dependencies
```
pip install -r requirements.txt
```
3. Run server
```
pytho3 arxiv_server.py
```
or if you want hot-reloading when you're further developing:
```
flask --app arxiv_server.py --debug run
```

## Editing author list
The author list can be found in `author_list.py`.

## Contributions
Welcome! Please create a PR.