class MotionReportGenerator {
  static generateReports(observedAnimations) {
    if (!observedAnimations || observedAnimations.length === 0) {
      return [];
    }
    return observedAnimations.map((animation, index) => {
      return this.generateSingleReport(animation, index);
    });
  }

  static generateSingleReport(animation, index) {
    const reportId = animation.id || `motion-${index + 1}`;
    const description = this.generateDescription(animation);
    const codeSnippets = {
      css: this.generateCSSSnippet(animation),
      js: this.generateJSSnippet(animation),
      gsap: this.generateGSAPSnippet(animation)
    };
    return {
      id: reportId,
      description,
      trigger: animation.trigger,
      duration: animation.duration,
      properties: animation.properties,
      element: animation.element,
      easing: animation.easing || 'ease',
      codeSnippets
    };
  }

  static generateDescription(animation) {
    const { element, trigger, properties, duration } = animation;
    const propertyNames = properties.map(p => p.property).join(', ');
    const triggerText = {
      'scroll': '스크롤 시',
      'hover': '호버 시',
      'load': '페이지 로드 시'
    }[trigger] || trigger;
    return `${element} 요소가 ${triggerText} ${propertyNames} 속성이 ${duration}ms 동안 변화하는 애니메이션`;
  }

  static generateCSSSnippet(animation) {
    const { element, properties, duration, easing } = animation;
    const animationName = this.sanitizeAnimationName(element);
    let keyframes = `@keyframes ${animationName} {\n`;
    keyframes += `  from {\n`;
    properties.forEach(prop => {
      keyframes += `    ${prop.property}: ${prop.from};\n`;
    });
    keyframes += `  }\n`;
    keyframes += `  to {\n`;
    properties.forEach(prop => {
      keyframes += `    ${prop.property}: ${prop.to};\n`;
    });
    keyframes += `  }\n`;
    keyframes += `}\n\n`;
    keyframes += `/* 애니메이션 적용 */\n`;
    keyframes += `${element} {\n`;
    keyframes += `  animation: ${animationName} ${duration}ms ${easing};\n`;
    keyframes += `}\n`;
    return keyframes;
  }

  static generateJSSnippet(animation) {
    const { element, properties, duration, easing, trigger } = animation;
    const keyframesFrom = {};
    const keyframesTo = {};
    properties.forEach(prop => {
      keyframesFrom[prop.property] = prop.from;
      keyframesTo[prop.property] = prop.to;
    });
    let code = `// Web Animation API를 사용한 애니메이션\n`;
    code += `const element = document.querySelector('${element}');\n\n`;
    code += `const keyframes = [\n`;
    code += `  ${JSON.stringify(keyframesFrom, null, 2).replace(/\n/g, '\n  ')},\n`;
    code += `  ${JSON.stringify(keyframesTo, null, 2).replace(/\n/g, '\n  ')}\n`;
    code += `];\n\n`;
    code += `const options = {\n`;
    code += `  duration: ${duration},\n`;
    code += `  easing: '${easing}',\n`;
    code += `  fill: 'forwards'\n`;
    code += `};\n\n`;
    if (trigger === 'scroll') {
      code += `// IntersectionObserver를 사용한 스크롤 트리거\n`;
      code += `const observer = new IntersectionObserver((entries) => {\n`;
      code += `  entries.forEach(entry => {\n`;
      code += `    if (entry.isIntersecting) {\n`;
      code += `      entry.target.animate(keyframes, options);\n`;
      code += `      observer.unobserve(entry.target);\n`;
      code += `    }\n`;
      code += `  });\n`;
      code += `}, { threshold: 0.1 });\n\n`;
      code += `observer.observe(element);\n`;
    } else if (trigger === 'hover') {
      code += `// 호버 이벤트 리스너\n`;
      code += `element.addEventListener('mouseenter', () => {\n`;
      code += `  element.animate(keyframes, options);\n`;
      code += `});\n`;
    } else if (trigger === 'load') {
      code += `// 페이지 로드 시 즉시 실행\n`;
      code += `element.animate(keyframes, options);\n`;
    }
    return code;
  }

  static generateGSAPSnippet(animation) {
    const { element, properties, duration, easing, trigger } = animation;
    const gsapProps = {};
    properties.forEach(prop => {
      gsapProps[prop.property] = prop.to;
    });
    const gsapEase = this.convertToGSAPEasing(easing);
    let code = `// GSAP를 사용한 애니메이션\n`;
    code += `// 설치: npm install gsap\n`;
    code += `import gsap from 'gsap';\n`;
    if (trigger === 'scroll') {
      code += `import ScrollTrigger from 'gsap/ScrollTrigger';\n`;
      code += `gsap.registerPlugin(ScrollTrigger);\n\n`;
      code += `gsap.to('${element}', {\n`;
      Object.entries(gsapProps).forEach(([key, value]) => {
        code += `  ${key}: '${value}',\n`;
      });
      code += `  duration: ${duration / 1000},\n`;
      code += `  ease: '${gsapEase}',\n`;
      code += `  scrollTrigger: {\n`;
      code += `    trigger: '${element}',\n`;
      code += `    start: 'top 80%',\n`;
      code += `    toggleActions: 'play none none none'\n`;
      code += `  }\n`;
      code += `});\n`;
    } else if (trigger === 'hover') {
      code += `\nconst element = document.querySelector('${element}');\n\n`;
      code += `element.addEventListener('mouseenter', () => {\n`;
      code += `  gsap.to(element, {\n`;
      Object.entries(gsapProps).forEach(([key, value]) => {
        code += `    ${key}: '${value}',\n`;
      });
      code += `    duration: ${duration / 1000},\n`;
      code += `    ease: '${gsapEase}'\n`;
      code += `  });\n`;
      code += `});\n`;
    } else if (trigger === 'load') {
      code += `\ngsap.to('${element}', {\n`;
      Object.entries(gsapProps).forEach(([key, value]) => {
        code += `  ${key}: '${value}',\n`;
      });
      code += `  duration: ${duration / 1000},\n`;
      code += `  ease: '${gsapEase}'\n`;
      code += `});\n`;
    }
    return code;
  }

  static convertToGSAPEasing(cssEasing) {
    const easingMap = {
      'ease': 'power1.inOut',
      'ease-in': 'power1.in',
      'ease-out': 'power1.out',
      'ease-in-out': 'power1.inOut',
      'linear': 'none'
    };
    return easingMap[cssEasing] || 'power1.inOut';
  }

  static sanitizeAnimationName(selector) {
    return selector
      .replace(/[^a-zA-Z0-9-]/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-+/g, '-')
      .toLowerCase() + '-animation';
  }

  static generateMarkdown(report) {
    let markdown = `# ${report.id}\n\n`;
    markdown += `## 설명\n\n`;
    markdown += `${report.description}\n\n`;
    markdown += `## 애니메이션 정보\n\n`;
    markdown += `- **요소**: \`${report.element}\`\n`;
    markdown += `- **트리거**: ${this.getTriggerDisplayName(report.trigger)}\n`;
    markdown += `- **지속 시간**: ${report.duration}ms\n`;
    markdown += `- **Easing**: ${report.easing}\n\n`;
    markdown += `## 속성 변화\n\n`;
    report.properties.forEach(prop => {
      markdown += `- **${prop.property}**: \`${prop.from}\`  \`${prop.to}\`\n`;
    });
    markdown += `\n`;
    markdown += `## 재구현 코드\n\n`;
    markdown += `### CSS @keyframes\n\n`;
    markdown += `\`\`\`css\n`;
    markdown += report.codeSnippets.css;
    markdown += `\`\`\`\n\n`;
    markdown += `### Web Animation API (JavaScript)\n\n`;
    markdown += `\`\`\`javascript\n`;
    markdown += report.codeSnippets.js;
    markdown += `\`\`\`\n\n`;
    if (report.codeSnippets.gsap) {
      markdown += `### GSAP (선택적)\n\n`;
      markdown += `\`\`\`javascript\n`;
      markdown += report.codeSnippets.gsap;
      markdown += `\`\`\`\n\n`;
    }
    markdown += `## 사용 방법\n\n`;
    markdown += `1. 위의 코드 스니펫 중 하나를 선택하여 프로젝트에 복사합니다.\n`;
    markdown += `2. 요소 선택자(\`${report.element}\`)를 실제 프로젝트의 선택자로 변경합니다.\n`;
    markdown += `3. 필요에 따라 duration, easing 등의 값을 조정합니다.\n`;
    markdown += `4. CSS 방식의 경우 스타일시트에 추가하고, JavaScript 방식의 경우 스크립트 파일에 추가합니다.\n\n`;
    return markdown;
  }

  static getTriggerDisplayName(trigger) {
    const displayNames = {
      'scroll': '스크롤',
      'hover': '호버',
      'load': '페이지 로드'
    };
    return displayNames[trigger] || trigger;
  }
}

module.exports = MotionReportGenerator;
