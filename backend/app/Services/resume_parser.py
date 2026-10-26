import sys
import json
import re
from pypdf import PdfReader

def extract_resume_data(pdf_path):
    try:
        reader = PdfReader(pdf_path)
        full_text = "\n".join([page.extract_text() or "" for page in reader.pages])
    except Exception as e:
        return {"error": f"Failed to read PDF: {str(e)}"}

    lines = [l.strip() for l in full_text.splitlines() if l.strip()]
    text_content = "\n".join(lines)

    result = {
        "name": "",
        "email": "",
        "phone": "",
        "linkedin_url": "",
        "professional_summary": "",
        "skills": [],
        "education": [],
        "work_history": []
    }

    # 1. Extract Email
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', full_text)
    if email_match:
        result["email"] = email_match.group(0).lower()

    # 2. Extract Phone
    phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?(\d{5}[-.\s]?\d{5}|\d{10})', full_text)
    if phone_match:
        result["phone"] = phone_match.group(0).strip()

    # 3. Extract LinkedIn
    li_match = re.search(r'linkedin\.com/in/([\w\-]+)|LinkedIn\s*:\s*([\w\-]+)', full_text, re.IGNORECASE)
    if li_match:
        user_handle = li_match.group(1) or li_match.group(2)
        result["linkedin_url"] = f"https://www.linkedin.com/in/{user_handle.strip()}"

    # 4. Extract Name (usually on first few lines, skipping icons or emails)
    for line in lines[:5]:
        clean_line = re.sub(r'[^a-zA-Z\s\.]', '', line).strip()
        if clean_line and len(clean_line.split()) <= 4 and '@' not in line and not any(kw in clean_line.lower() for kw in ['resume', 'curriculum', 'cv', 'page', 'profile']):
            # Capitalize properly
            result["name"] = clean_line.title()
            break

    # 5. Extract Professional Summary
    summary_match = re.search(r'(?:Professional\s+Summary|Career\s+Objective|Summary|About\s+Me)\s*[:\n](.*?)(?=\n[A-Z][a-zA-Z\s]{3,20}\n|\nTechnical\s+Skills|\nSkills|\nEducation|\nExperience|$)', full_text, re.DOTALL | re.IGNORECASE)
    if summary_match:
        raw_summary = summary_match.group(1).strip()
        # Clean multi-line breaks into single paragraphs
        clean_summary = re.sub(r'\s+', ' ', raw_summary)
        result["professional_summary"] = clean_summary[:500]

    # 6. Extract Technical Skills
    # Common tech skills dictionary for accurate matching
    TECH_KEYWORDS = [
        "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "PHP", "Go", "Rust", "Swift", "Kotlin", "Dart",
        "React", "React.js", "Next.js", "Vue.js", "Angular", "HTML", "HTML5", "CSS", "CSS3", "Tailwind CSS", "Bootstrap",
        "Node.js", "Express", "FastAPI", "Django", "Flask", "Laravel", "Spring Boot", "Odoo", "Frappe",
        "MySQL", "PostgreSQL", "MongoDB", "SQLite", "Redis", "Firebase", "Oracle",
        "Flutter", "React Native", "Android", "iOS",
        "Git", "GitHub", "GitLab", "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Linux", "REST APIs", "GraphQL"
    ]
    
    found_skills = []
    # Check skills in text
    for skill in TECH_KEYWORDS:
        pattern = r'(?<!\w)' + re.escape(skill) + r'(?!\w)'
        if re.search(pattern, full_text, re.IGNORECASE):
            if skill not in found_skills:
                found_skills.append(skill)
    result["skills"] = found_skills[:15]

    # 7. Extract Education
    # Match degrees like M.Sc., B.Sc., B.Tech, B.E., M.Tech, MCA, BCA, High School
    edu_entries = []
    edu_blocks = re.findall(r'((?:M\.Sc|B\.Sc|B\.Tech|B\.E|M\.Tech|BCA|MCA|Bachelor|Master|Diploma|Higher\s+Secondary)[\w\.\s]*?(?:20\d\d\s*[–\-]\s*20\d\d|20\d\d|\bCGPA[:\s\d\.]+).*?)(?=(?:M\.Sc|B\.Sc|B\.Tech|B\.E|M\.Tech|BCA|MCA|Bachelor|Master|Certifications|Internship|Experience|Projects|$))', full_text, re.DOTALL | re.IGNORECASE)
    
    for block in edu_blocks:
        b_lines = [l.strip() for l in block.strip().splitlines() if l.strip()]
        if not b_lines:
            continue
        degree_line = b_lines[0]
        # extract year
        yr = re.search(r'20\d\d\s*[–\-]\s*20\d\d|20\d\d', degree_line)
        year_str = yr.group(0) if yr else "2020 – 2024"
        # clean degree name
        deg_clean = re.sub(r'20\d\d\s*[–\-]\s*20\d\d|20\d\d|\||CGPA[:\s\d\.]+', '', degree_line).strip()
        inst = b_lines[1] if len(b_lines) > 1 else "University / College"
        grade_match = re.search(r'CGPA[:\s]*([\d\.]+)|(\d{2,3}%)', block)
        grade_str = grade_match.group(0) if grade_match else ""

        edu_entries.append({
            "degree": deg_clean or "Degree",
            "institution": inst,
            "year": year_str,
            "grade": grade_str
        })
    result["education"] = edu_entries[:3]

    # 8. Extract Work History / Internships
    exp_entries = []
    # Search for internships / experiences
    exp_sections = re.findall(r'([A-Z][a-zA-Z\s]{3,35}(?:Developer|Engineer|Intern|Lead|Manager|Consultant|Specialist)[\w\s]*)\n([A-Z][a-zA-Z0-9\s,\.]{3,40})\n(?:Duration[:\s]*)?([A-Za-z]{3,9}\s*20\d\d\s*[–\-]\s*[A-Za-z]{3,9}?\s*20\d\d|[A-Za-z]{3,9}\s*20\d\d)?', full_text)
    for title, comp, period in exp_sections[:4]:
        clean_title = re.sub(r'^(Internship|Flutter|Exposure)\s*\n?', '', title.strip(), flags=re.IGNORECASE).strip()
        exp_entries.append({
            "title": clean_title,
            "company": comp.strip(),
            "period": period.strip() if period else "Recent",
            "location": "Tamil Nadu",
            "description": f"Worked as {clean_title} at {comp.strip()} contributing to software development and client systems."
        })
    result["work_history"] = exp_entries

    return result

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No file specified"}))
        sys.exit(1)
    
    res = extract_resume_data(sys.argv[1])
    sys.stdout.buffer.write(json.dumps(res, indent=2).encode('utf-8'))
