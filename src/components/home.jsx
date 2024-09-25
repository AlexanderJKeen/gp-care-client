import React from 'react';
import './home.css';

function Home() {
    return (
      <article>
        <section className="home" data-testid="home-section">
          <input type="text" placeholder="Search.." />
        </section>
        <section className='card' data-testid="card-section"> </section>
      </article>
    );
}

export default Home;
