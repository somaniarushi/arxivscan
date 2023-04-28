import Head from "next/head";
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const arxiv_url = "http://export.arxiv.org/api/query"

export default function Home() {
  // Get list of authors from localStorage
  const [authors, setAuthors] = useState([]);
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    // Get list of authors from localStorage
    const authors = JSON.parse(localStorage.getItem("authors"));
    if (authors) {
      setAuthors(authors);
    }
  }, []);

  useEffect(() => {
    // author_list = 'au:"{}"'.format('" OR au:"'.join(authorList))
    const author_list = authors.map((author) => `au:"${author}"`).join(" OR ");
      fetch(arxiv_url + `?search_query=${author_list}&start=0&max_results=100&sortBy=submittedDate&sortOrder=descending`)
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        // Parse data to get list of papers
        let curr_papers = [];
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "text/xml");
        const entries = xmlDoc.getElementsByTagName("entry");
        const papers = [];
        for (let i = 0; i < entries.length; i++) {
          // Retrieve title, authors, summary, link and published date
          const title = entries[i].getElementsByTagName("title")[0].innerHTML;
          const authors = entries[i].getElementsByTagName("author");
          const author_list = [];
          for (let j = 0; j < authors.length; j++) {
            author_list.push(authors[j].getElementsByTagName("name")[0].innerHTML);
          }
          const summary = entries[i].getElementsByTagName("summary")[0].innerHTML;
          const link = entries[i].getElementsByTagName("link")[0].getAttribute("href");
          const published = entries[i].getElementsByTagName("published")[0].innerHTML;
          curr_papers.push({
            title: title,
            authors: author_list,
            summary: summary,
            link: link,
            published: published,
          });
        }
        setPapers(curr_papers);
      });
  }, [authors])

  return (
    <div className={styles.container}>
      <Head>
        <title>Arxvi Scan</title>
        <meta name="description" content="Scanner for Arxiv Based on Author" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Add title */}
      <main className={styles.main}>
        <h1 className={styles.title}>Arxiv Scan</h1>
        {/* Create textbox that accepts list of authors */}
        <div className={styles.centeredflex}>
          <p>Enter a list of authors to scan for</p>
          <form className={styles.centeredflex}>
            <textarea id="authors" name="authors" rows="4" cols="50" className={styles.textbox}
              placeholder="Enter authors here"
              defaultValue={"Ion Stoica"}
            ></textarea>
            <br />
            <input
              type="submit"
              value="Submit"
              className={styles.submit}
              onClick={async (e) => {
                e.preventDefault();
                const authors = document
                  .getElementById("authors")
                  // Split by comma
                  .value.split(",")
                // Save author list to localStorage
                localStorage.setItem("authors", JSON.stringify(authors));
                setAuthors(authors);
              }}
            />
          </form>
        </div>

        {/* Display papers */}
        <div>
          {papers.map((paper) => (
            <div className={styles.widecard} key={paper.link}>
            <a href={paper.link} key={paper.link}>
              <div>
              <h3 className={styles.subtitle}>{paper.title}</h3>
              <p>{paper.authors.join(", ")}</p>
              {/* <p>{paper.authors.join(", ")}</p> */}
              {/* Get author name that is in state list, display in bold */}
              <p>{paper.summary}</p>
              {/* Prettify Date */}
              <p>{new Date(paper.published).toDateString()}</p>
            </div>
            </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
