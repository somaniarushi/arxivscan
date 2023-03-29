from flask import Flask

import requests
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
from author_list import authorList

app = Flask(__name__)


# Arxiv API endpoint for search
arxiv_url = "http://export.arxiv.org/api/query"

@app.route("/")
def search():
    print("Searching for papers...")
    # Get the current date
    import datetime
    today = datetime.datetime.now()

    # Format the date for the arxiv API query
    date = today.strftime("%Y-%m-%d")

    author_list = 'au:"{}"'.format('" OR au:"'.join(authorList))
    print(author_list)
    # Send the request to the arxiv API
    response = requests.get(arxiv_url + f'?search_query={author_list}&start=0&max_results=100&sortBy=submittedDate&sortOrder=descending')

    # print(response)
    # print(response.content)

    # Parse the XML response
    soup = BeautifulSoup(response.content, 'xml')

    # Get all the paper entries
    entries = soup.find_all('entry')

    papers = []
    # Get title, summary, author, link, date
    for entry in entries:
        title = entry.find('title').text
        summary = entry.find('summary').text
        authors = entry.find_all('author')
        authors = [author.find('name').text for author in authors]
        link = entry.find('id').text
        date = entry.find('published').text
        papers.append((title, summary, authors, link, date))

    # Build the HTML response with the paper titles, summaries, author
    # papers = [] # TODO: Remove
    html = "<html><body>"
    for paper in papers:
        html += f"<h1>{paper[0]}</h1>"
        html += f"<p>Authors: {paper[2]}</p>"
        # Format date properly
        date = paper[4].split('T')[0]
        html += f"<p>Published: {date}</p>"
        html += f"<p>{paper[1]}</p>"
        html += f"<a href={papers[3]}>{paper[3]}</a>"
    html += "</body></html>"

    return html

if __name__ == "__main__":
    app.run()