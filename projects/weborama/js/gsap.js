document.addEventListener('DOMContentLoaded', function () {
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger)
    
    const section = document.querySelector('#one')
    if (section) {
      const startPos = 'top top'

      const triangles = Array.from(section.querySelectorAll('.triangle'))
      if (triangles.length) {
        const setInitial = () => {
          const w = window.innerWidth
          const offset = w * 0.5

          triangles.forEach((triangle, idx) => {
            if (idx === 0 || idx === 2) {
              gsap.set(triangle, { x: -offset, force3D: true })
            } else {
              gsap.set(triangle, { x: offset, force3D: true })
            }
          })
        }

        const tlTriangles = gsap.timeline()
        const tlContent = gsap.timeline()

        const isMobile = window.innerWidth <= 768
        
        tlTriangles.to(triangles, {
          x: 0,
          ease: 'power1.out',
          duration: 0.6
        })

        tlContent
          .fromTo(
            section.querySelector('.item__wrapper-info-title'),
            { y: 80, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, ease: 'power1.out' }
          )
          .fromTo(
            section.querySelector('.item__wrapper-info-text'),
            { y: 80, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, ease: 'power1.out' },
            '-=0.2'
          )
          .fromTo(
            section.querySelector('.item__wrapper-btn'),
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, ease: 'power1.out' },
            '-=0.2'
          )

        gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: isMobile ? 'top 40%' : 'top 30%',
            end: 'bottom bottom',
            scrub: 1.2,
            onRefresh: setInitial
          }
        })
        .add(tlTriangles, 0)
        .add(tlContent, 0.3)

        setInitial()
      }
    }

    const sectionTwo = document.querySelector('#two')
    if (sectionTwo) {
      const circles = Array.from(sectionTwo.querySelectorAll('.two__circles .circle'))
      if (circles.length) {
        const endDistance = `+=${circles.length * 50}%`
        ScrollTrigger.create({
          trigger: sectionTwo,
          start: 'top top',
          end: endDistance
        })

        const isMobile = () => window.innerWidth < 768

        if (isMobile()) {
          const setInitial = () => {
            circles.forEach((el, idx) => {
              const rect = el.getBoundingClientRect()
              const quarter = rect.width * 0.5
              if (idx === 0) {
                gsap.set(el, { x: -quarter, force3D: true })
              } else if (idx === 1) {
                gsap.set(el, { x: quarter, force3D: true })
              } else {
                gsap.set(el, { x: 0, force3D: true })
              }
            })
          }

          const tlCircles = gsap.timeline()
          const tlContent = gsap.timeline()

          circles.forEach((el, idx) => {
            const dur = idx === 2 ? 0.8 : 0.8
            const pos = idx === 0 ? 0 : '<+0.08'
            tlCircles.to(el, { x: 0, ease: 'power3.out', duration: dur }, pos)
          })

          tlContent
            .fromTo(
              sectionTwo.querySelector('.item__wrapper-info-title'),
              { y: 80, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: 'power1.out' }
            )
            .fromTo(
              sectionTwo.querySelector('.item__wrapper-info-text'),
              { y: 80, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: 'power1.out' },
              '-=0.2'
            )
            .fromTo(
              sectionTwo.querySelector('.item__wrapper-btn'),
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: 'power1.out' },
              '-=0.2'
            )

          gsap.timeline({
            scrollTrigger: {
              trigger: sectionTwo,
              start: 'top 40%',
              end: 'bottom bottom',
              scrub: 1.2,
              onRefresh: setInitial
            }
          })
          .add(tlCircles, 0)
          .add(tlContent, 0.3)

          setInitial()
        } else {
          const setInitial = () => {
            const w = window.innerWidth
            const base = w + 300
            circles.forEach((circle, i) => {
              if (i === 0) {
                const offset50 = circle.getBoundingClientRect().width * 0.5
                gsap.set(circle, { x: offset50, opacity: 0, force3D: true })
              } else {
                gsap.set(circle, { x: base, force3D: true })
              }
            })
          }

          const tlCircles = gsap.timeline()
          const tlContent = gsap.timeline()

          tlCircles
            .to(circles[2], { x: 0, ease: 'power1.out', duration: 20 }, 0)
            .to(circles[1], { x: 0, ease: 'power1.out', duration: 20 }, 3.6)
            .to(circles[0], { x: 0, opacity: 1, ease: 'power1.out', duration: 20 }, 19)

          tlContent
            .fromTo(
              sectionTwo.querySelector('.item__wrapper-info-title'),
              { y: 80, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: 'power1.out' }
            )
            .fromTo(
              sectionTwo.querySelector('.item__wrapper-info-text'),
              { y: 80, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: 'power1.out' },
              '-=0.2'
            )
            .fromTo(
              sectionTwo.querySelector('.item__wrapper-btn'),
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: 'power1.out' },
              '-=0.2'
            )

          gsap.timeline({
            scrollTrigger: {
              trigger: sectionTwo,
              start: 'top 30%',
              end: 'bottom bottom',
              scrub: 1.2,
              onRefresh: setInitial
            }
          })
          .add(tlCircles, 0)
          
          gsap.timeline({
            scrollTrigger: {
              trigger: sectionTwo,
              start: 'top 30%',
              end: 'bottom bottom',
              scrub: 1.2
            }
          })
          .add(tlContent, 0)

          setInitial()
        }
      }
    }
    
    const sectionThree = document.querySelector('#three')
    if (sectionThree) {
      const squaresForEnd = Array.from(sectionThree.querySelectorAll('.three__squares .square'))
      const endDistance = 'bottom bottom'
      ScrollTrigger.create({
        trigger: sectionThree,
        start: 'top top',
        end: endDistance
      })

      const squares = Array.from(sectionThree.querySelectorAll('.three__squares .square'))
      if (squares.length) {
        const endDistanceTl = 'bottom bottom'

        const tlSquares = gsap.timeline()
        const tlContent = gsap.timeline()

        const setInitial = () => {
          squares.forEach(square => {
            gsap.set(square, { opacity: 0 })
          })
        }

        tlSquares
          .to(squares, { opacity: 1, stagger: 0.3, ease: 'power1.out', duration: 1 })

        tlContent
          .fromTo(
            sectionThree.querySelector('.item__wrapper-info-title'),
            { y: 80, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power1.out' }
          )
          .fromTo(
            sectionThree.querySelector('.item__wrapper-info-text'),
            { y: 80, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power1.out' },
            '-=0.2'
          )
          .fromTo(
            sectionThree.querySelector('.item__wrapper-btn'),
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power1.out' },
            '-=0.2'
          )

        gsap.timeline({
          scrollTrigger: {
            trigger: sectionThree,
            start: 'top 30%',
            end: endDistanceTl,
            scrub: 1.2,
            onRefresh: setInitial
          }
        })
        .add(tlSquares, 0)
        .add(tlContent, 0.3)

        setInitial()
      }
    }

    const questions = document.querySelector('.questions')
    if (questions) {
      const items = questions.querySelectorAll('.questions__wrapper-items-item')
      if (items.length) {
        const setInitial = () => {
          const w = window.innerWidth
          const isMobile = w < 500
          const base = isMobile ? 60 : 100
          const marginLefts = []
          items.forEach(item => {
            const styles = getComputedStyle(item)
            const marginLeft = parseFloat(styles.marginLeft) || 0
            marginLefts.push(marginLeft)
          })

          items.forEach((item, i) => {
            let offset = base
            if (i === 0) offset += (marginLefts[1] || 0)
            else if (i === 1) offset += (marginLefts[1] || 0) * 0.5
            gsap.set(item, { x: offset, opacity: 0, force3D: true })
          })
        }

        gsap.timeline({
          scrollTrigger: {
            trigger: questions,
            start: 'top 40%',
            end: 'bottom 80%',
            scrub: 1.5,
            onRefresh: setInitial
          }
        })
        .to(items, {
          x: 0,
          opacity: 1,
          stagger: 0.1,
          ease: 'power2.out',
          duration: 1.5
        }, 0)

        setInitial()
      }
    }

    const scrollSections = document.querySelectorAll('.scroll')
    if (scrollSections.length) {
      scrollSections.forEach(scrollSec => {
        const wrapper = scrollSec.querySelector('.scroll__wrapper')
        const line = scrollSec.querySelector('.scroll__wrapper-line')
        const logo = scrollSec.querySelector('.scroll__wrapper-line-logo')
        if (!wrapper || !line || !logo) return

        const header = document.querySelector('header')
        const offset = header ? header.offsetHeight : 0
        const startPos = offset ? `top 25%` : 'top top'

        // ScrollTrigger.create({
        //   trigger: scrollSec,
        //   start: startPos,
        //   end: '+=100%',
        //   pin: wrapper,
        //   pinSpacing: true,
        //   anticipatePin: 1
        // })

        const initLogoAnim = () => {
          const maxY = Math.max(0, line.clientHeight - logo.clientHeight)
          gsap.set(logo, { y: 0 })
          if (logo._st) logo._st.kill()
          logo._st = gsap.to(logo, {
            y: maxY,
            ease: 'none',
            scrollTrigger: {
              trigger: scrollSec,
              start: startPos,
              end: '+=50%',
              scrub: 0.1
            }
          })
        }
        initLogoAnim()
        const onRefresh = () => initLogoAnim()
        ScrollTrigger.addEventListener('refreshInit', onRefresh)
        window.addEventListener('resize', () => { initLogoAnim(); ScrollTrigger.refresh() })
      })
    }
  }
})

