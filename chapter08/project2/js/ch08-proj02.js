/* add your code here */
<script src="js/photo-data.js"></script>
const photoData = JSON.parse(content);
const section = document.querySelector('main section');
section.innerHTML = "";

photoData.forEach(photo => {
    
    const article = document.createElement('article');

    
    const img = document.createElement('img');
    img.src = `/chapter08/project2/images/${photo.filename}`;
    img.alt = photo.title;
    article.appendChild(img);

    
    const caption = document.createElement('div');
    caption.className = 'caption';

    
    const h2 = document.createElement('h2');
    h2.textContent = photo.title;
    caption.appendChild(h2);

    
    const p = document.createElement('p');
    p.textContent = `${photo.location.city}, ${photo.location.country}`;
    caption.appendChild(p);

    
    const h3 = document.createElement('h3');
    h3.textContent = 'Colors';
    caption.appendChild(h3);

    
    photo.colors.forEach(color => {
        const span = document.createElement('span');
        span.textContent = color.name;
        span.style.backgroundColor = color.hex;

        
        if (color.luminance < 80) {
            span.style.color = 'white';
        }
        caption.appendChild(span);
    });

    
    article.appendChild(caption);

    
    section.appendChild(article);
});