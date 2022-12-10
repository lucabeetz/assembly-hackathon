import ebooklib
from ebooklib import epub
import fitz


def get_paragraphs_from_pdf(file):
    doc = fitz.open(file)
    paragraphs:list[tuple[str, int]] = []
    for page in doc:
        blocks = page.get_text("blocks")
        for b in blocks:
            if b[-1] == 0 and b[4].split(' ').__len__() > 10:
                paragraphs.append((b[4].strip('\n'), page.number))
    return paragraphs


def get_paragraphs_from_epub(path):
    book = epub.read_epub(path)
    parts = list(book.get_items_of_type(ebooklib.ITEM_DOCUMENT))
    paragraphs = parts_to_paragraphs(parts)
    return paragraphs

def parts_to_paragraphs(parts):
    paragraphs = []
    for part in parts:
        soup = BeautifulSoup(part.get_body_content(), 'html.parser')

        for p in soup.find_all('p'):
            text = p.get_text()
            paragraphs.append(text)

    return paragraph