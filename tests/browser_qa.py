from playwright.sync_api import sync_playwright
from pathlib import Path
import json
root=Path(__file__).resolve().parent.parent
def load_app(page):
    html=(root/'index.html').read_text()
    page.set_content(html,wait_until='domcontentloaded')
    page.add_style_tag(content=(root/'styles.css').read_text())
    page.evaluate("""() => { const data={}; Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(k){return data[k]??null},setItem(k,v){data[k]=String(v)},removeItem(k){delete data[k]}}}) }""")
    page.add_script_tag(content=(root/'core.js').read_text())
    page.add_script_tag(content=(root/'app.js').read_text())
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 reports=[]
 for width in (280,320,375,430,768,1024,1440):
  page=browser.new_page(viewport={'width':width,'height':850},device_scale_factor=1)
  errors=[];page.on('pageerror',lambda x: errors.append(str(x)))
  load_app(page)
  page.locator('#name').fill('Alex Morgan');page.locator('#role').fill('Marketing Coordinator');page.locator('#company').fill('Northstar Studio')
  page.locator('#skills').fill('Campaign planning, project management, customer communication')
  page.locator('#evidence').fill('I delivered a six-week campaign ahead of schedule and supported a small project team.')
  page.locator('#motivation').fill('the position combines creative thinking with measurable outcomes')
  page.locator('#tailor summary').click();page.locator('#job').fill('This position needs project management and creative campaign planning and communication skills.')
  page.locator('#generateBtn').click()
  result=page.locator('#letterText').input_value()
  assert 'Alex Morgan' in result and 'Northstar Studio' in result and 'project management' in result and 'ahead of schedule' in result,(width,result)
  assert page.locator('#copyBtn').is_enabled()
  assert not errors,errors
  over=page.evaluate('document.documentElement.scrollWidth > innerWidth + 1')
  assert not over,('overflow',width)
  if width in (375,1440): page.screenshot(path=str(root/'tests'/f'screen_{width}.png'),full_page=True)
  # on tablet test local-storage privacy flow
  if width==768:
   page.locator('#saveBtn').click(); assert 'saved locally' in page.locator('#notice').inner_text()
  reports.append({'width':width,'no_js_errors':True,'no_horizontal_overflow':True,'generated_words':len(result.split())})
  page.close()
 # separate persistence, print, and copy checks
 page=browser.new_page(viewport={'width':390,'height':844},accept_downloads=True)
 load_app(page)
 page.locator('#name').fill('Sam Carter');page.locator('#role').fill('Designer');page.locator('#company').fill('Studio Example');page.locator('#skills').fill('Illustration, HTML');page.locator('#generateBtn').click()
 page.locator('#letterText').fill('Edited letter — written by Sam Carter.')
 page.locator('#saveBtn').click()
 page.locator('#letterText').fill('')
 page.locator('#loadBtn').click()
 assert page.locator('#letterText').input_value()=='Edited letter — written by Sam Carter.'
 with page.expect_download() as dl: page.locator('#downloadBtn').click()
 assert dl.value.suggested_filename.startswith('cover-letter-')
 page.on('dialog',lambda d:d.accept())
 page.locator('#deleteBtn').click()
 page.locator('#letterText').fill('')
 page.locator('#loadBtn').click()
 assert 'No saved draft' in page.locator('#notice').inner_text()
 page.locator('#letterText').fill('Edited letter — written by Sam Carter.')
 # print action populates printable text outside hidden panel header
 page.evaluate('window.print = () => {}')
 page.locator('#printBtn').click()
 assert page.locator('#printContent').inner_text().strip()=='Edited letter — written by Sam Carter.'
 assert page.evaluate('getComputedStyle(document.querySelector("#printContent")).display')=='none'
 page.emulate_media(media='print')
 assert page.evaluate('getComputedStyle(document.querySelector("#printContent")).display')=='block'
 page.emulate_media(media='screen')
 # ensure safely treated as text (no HTML injection)
 page.locator('#name').fill('<img src=x onerror=alert(42)>');page.locator('#role').fill('Analyst');page.locator('#company').fill('Test')
 page.locator('#generateBtn').click();assert page.locator('img[src=x]').count()==0
 page.close();browser.close()
print('BROWSER_REPORT',json.dumps(reports))
print('Export, save/load/delete, and malicious HTML text safety PASS')
