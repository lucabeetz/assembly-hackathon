import ebooklib
from ebooklib import epub
import fitz
from bs4 import BeautifulSoup
import os
import shutil


def get_paragraphs_from_pdf(file):
    doc = fitz.open(file)
    paragraphs:list[tuple[str, int]] = []
    for page in doc:
        blocks = page.get_text("blocks")
        for b in blocks:
            if b[-1] == 0 and b[4].split(' ').__len__() > 10:
                paragraphs.append((b[4].strip('\n'), page.number))
    return paragraphs

def enumerate_p_tags_epub(epub_filepath, book_uid = None):
    # Read metadata from old book
    old_book = epub.read_epub(epub_filepath)
    book_uid = old_book.get_metadata('DC', 'identifier')[0][0] if book_uid == None else book_uid
    old_book_title = old_book.get_metadata('DC', 'title')[0][0]
    old_book_language = old_book.get_metadata('DC', 'language')[0][0]
    old_book_author = old_book.get_metadata('DC', 'creator')[0][0]

    # Create a new book with the same metadata
    new_book = epub.EpubBook()
    new_book.set_identifier(book_uid)
    new_book.set_title(old_book_title)
    new_book.set_language(old_book_language)
    new_book.add_author(old_book_author)
    new_book.spine = old_book.spine

    # Loop through all content of the old book 
    # inject uid's into the p tags 
    # and add the content to the new book
    for item in old_book.get_items():
        if item.get_type() == ebooklib.ITEM_DOCUMENT:
            soup = BeautifulSoup(item.get_body_content(), 'html.parser')
            id = 0
            for p in soup.find_all('p'):
                p['id'] = f'{book_uid}_{item.get_name()}_{id}'
                id+=1
            item.set_content(str(soup))
        new_book.add_item(item)
        new_book.spine.append(item)
    # delete old book and write new book
    try:
        os.remove(epub_filepath)
    except:
        shutil.rmtree(epub_filepath)
    epub.write_epub(epub_filepath, new_book, {})

def get_paragraphs_from_epub(epub_filepath):
    def chapter_to_paragraphs(chapter, i):
        soup = BeautifulSoup(chapter.get_body_content(), 'html.parser')
        paragraphs: list[tuple[str, str]] = []
        for p in soup.find_all('p'):
            p_id = p['id']
            if len(p.get_text().split(' ')) > 5:
                paragraphs.append(p.get_text(), p_id)
        return paragraphs, i
        
    book = epub.read_epub(epub_filepath)
    chapters = list(book.get_items_of_type(ebooklib.ITEM_DOCUMENT))

    paragraphs: list[tuple[str,str]] = []
    i = 0
    for c in chapters:
        paras, i = chapter_to_paragraphs(c,i)
        if len(paras) > 0:
            paragraphs.append(paras)

    return paragraphs