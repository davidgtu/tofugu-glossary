/**
 * A chrome extension that adds a floating div with clickable hiragana and romaji to the Tofugu Hiragana Chart page.
 * Basically, a glossary for that site, aimed to reduce the frustration of scrolling through the page to find the hiragana you want.
 */

// Select all audio sentence containers
const sentenceContainers = document.querySelectorAll(
  '.article-audio-sentence-player'
);

/**
 * because i'm lazy and don't want to type out all the hiragana and romaji
 * grab all the hiragana and romaji from the page and store them in an array of objects
 * @type {Array<{hiragana: string, romaji: string}> | 'Dakuten' | 'Combination'}
 */
const hiraganaData = Array.from(sentenceContainers).map((container) => {
  // Get the next two sibling elements (Hiragana and Romaji)
  const hiraganaElement = container.nextElementSibling?.querySelector('span');
  const romajiElement =
    container.nextElementSibling?.nextElementSibling?.querySelector('span');

  return {
    hiragana: hiraganaElement?.textContent.trim() || 'N/A',
    romaji: romajiElement?.textContent.trim() || 'N/A',
  };
});

// remove anything past 'ん' (last hiragana)
hiraganaData.splice(46);
hiraganaData.push('Dakuten');
hiraganaData.push('Combination');

/**
 * Scroll to the hiragana element using the imag's alt attribute
 * @param {string} hiragana
 */
function scrollToHiragana(hiragana) {
  const hiraganaElement = document.querySelector(`[alt*="${hiragana}"]`);
  if (hiraganaElement) {
    hiraganaElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    console.warn(`Could not find element for ${hiragana}`);
  }
}

// Create the floating div for the hiragana list
const newDiv = document.createElement('div');
newDiv.style.overflow = 'auto';
newDiv.style.maxHeight = '90vh';
newDiv.style.background = 'white';
newDiv.style.padding = '10px';
newDiv.style.borderRadius = '8px';

// Populate the div with clickable hiragana and romaji
hiraganaData.forEach((kana) => {
  const item = document.createElement('div');
  if (kana === 'Dakuten') {
    item.innerHTML = `<strong style="font-size: 20px;">Dakuten</strong>`;
    item.style.cursor = 'pointer';
    item.style.padding = '12px';
    item.style.transition = 'background 0.3s';
    item.style.borderBottom = '1px solid #ddd';
    item.style.display = 'flex';
    item.style.justifyContent = 'space-between';
    item.style.alignItems = 'center';
  } else if (kana === 'Combination') {
    item.innerHTML = `<strong style="font-size: 20px;">Combination</strong>`;
    item.style.cursor = 'pointer';
    item.style.padding = '12px';
    item.style.transition = 'background 0.3s';
    item.style.borderBottom = '1px solid #ddd';
    item.style.display = 'flex';
    item.style.justifyContent = 'space-between';
    item.style.alignItems = 'center';
  } else if (kana.hiragana && kana.romaji) {
    const { hiragana, romaji } = kana;
    item.innerHTML = `<strong style="font-size: 20px;">${hiragana}</strong> <span style="font-size: 18px; color: gray;">(${romaji})</span>`;
    item.style.cursor = 'pointer';
    item.style.padding = '12px';
    item.style.transition = 'background 0.3s';
    item.style.borderBottom = '1px solid #ddd';
    item.style.display = 'flex';
    item.style.justifyContent = 'space-between';
    item.style.alignItems = 'center';
  }

  // Hover effect
  item.addEventListener(
    'mouseover',
    () => (item.style.backgroundColor = '#268bd2')
  );
  item.addEventListener(
    'mouseout',
    () => (item.style.backgroundColor = 'white')
  );

  // Click event
  item.addEventListener('click', () => {
    const isCombinationOrDakuten = kana === 'Dakuten' || kana === 'Combination';
    if (isCombinationOrDakuten) {
      const element = document.getElementById(
        kana === 'Dakuten' ? 'dakuten--han-dakuten' : 'combination-hiragana'
      );
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    scrollToHiragana(kana.hiragana);
  });

  newDiv.appendChild(item);
});

// Style it to stand out
newDiv.style.position = 'fixed';
newDiv.style.top = '7%';
newDiv.style.right = '5%';
newDiv.style.zIndex = '1000';
newDiv.style.fontSize = '24px';
newDiv.style.border = '2px solid #0275d8';
newDiv.style.color = '#0275d8';

// Append the div to the body
document.body.appendChild(newDiv);
