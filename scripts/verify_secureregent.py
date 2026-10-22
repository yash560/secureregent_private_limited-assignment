#!/usr/bin/env python3
"""
Comprehensive Playwright Verification Suite for SecureRegent Dashboard
Protocol SOP-01 Compliant
"""

import sys
import time
from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:3999"

def run_tests():
    console_errors = []
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        # 1. Desktop 1440px Test
        print("\n--- [PHASE 1: DESKTOP 1440PX FUNCTIONAL VERIFICATION] ---")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda err: console_errors.append(str(err)))
        
        page.goto(BASE_URL, wait_until="networkidle")
        time.sleep(1)
        
        body_text = page.inner_text("body")
        assert "SecureRegent" in body_text, "Brand title missing"
        assert "Powered by TheWebVale" in body_text, "Powered by TheWebVale missing in footer"
        assert "Engineered by Yash Jain" not in body_text, "Personal name leaked in UI"
        print("✓ Desktop 1440px loaded cleanly with Powered by TheWebVale verified")

        # 2. Test Tab Switching
        print("\n--- [PHASE 2: TAB SWITCHING & INTERACTIVE DRILL-DOWN] ---")
        for tab_name in ["Quotations", "Deals", "Orders", "Hierarchy Tree", "Overview"]:
            btn = page.locator(f"button:has-text('{tab_name}')").first
            if btn.is_visible():
                btn.click()
                time.sleep(0.3)
                print(f"✓ Clicked tab: {tab_name}")
                
        # 3. Tri-Axis Viewport Inspection: Tablet 768px
        print("\n--- [PHASE 3: TRI-AXIS VIEWPORT INSPECTION] ---")
        tablet_page = browser.new_page(viewport={"width": 768, "height": 1024})
        tablet_page.goto(BASE_URL, wait_until="networkidle")
        time.sleep(0.5)
        sw_tab = tablet_page.evaluate("() => document.documentElement.scrollWidth")
        cw_tab = tablet_page.evaluate("() => document.documentElement.clientWidth")
        assert sw_tab <= cw_tab, f"Tablet horizontal overflow: {sw_tab} > {cw_tab}"
        print(f"✓ Tablet 768px clean (scrollWidth: {sw_tab}px, clientWidth: {cw_tab}px)")
        tablet_page.close()

        # 4. Tri-Axis Viewport Inspection: Mobile 360px
        mobile_page = browser.new_page(viewport={"width": 360, "height": 800})
        mobile_page.goto(BASE_URL, wait_until="networkidle")
        time.sleep(0.5)
        sw_mob = mobile_page.evaluate("() => document.documentElement.scrollWidth")
        cw_mob = mobile_page.evaluate("() => document.documentElement.clientWidth")
        assert sw_mob <= cw_mob, f"Mobile horizontal overflow: {sw_mob} > {cw_mob}"
        print(f"✓ Mobile 360px clean (scrollWidth: {sw_mob}px, clientWidth: {cw_mob}px)")
        mobile_page.close()

        # 5. Console Error Assertion
        real_errors = [e for e in console_errors if "favicon" not in e and "font" not in e]
        assert len(real_errors) == 0, f"Found console errors: {real_errors}"
        print(f"✓ Zero console errors detected (total: {len(real_errors)})")
        
        browser.close()
        print("\n🎉 SECUREREGENT QA VERIFICATION COMPLETED WITH 0 ERRORS!\n")

if __name__ == "__main__":
    run_tests()
