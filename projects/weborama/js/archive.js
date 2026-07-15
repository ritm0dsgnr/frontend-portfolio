document.addEventListener('DOMContentLoaded', function () {
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger)

    //v1
    // const section = document.querySelector('#one')
    // if (section) {
    //   const startPos = 'top top'
    //   ScrollTrigger.create({
    //     trigger: section,
    //     start: startPos,
    //     end: '+=120%',
    //     pin: true,
    //     pinSpacing: true,
    //     anticipatePin: 1
    //   })

    //   const tl = gsap.timeline({
    //     scrollTrigger: {
    //       trigger: section,
    //       start: startPos,
    //       end: '+=120%',
    //       scrub: 1
    //     }
    //   })

    //   const tlTriangles = gsap.timeline()
    //   const tlContent = gsap.timeline()

    //   const pathTL = section.querySelector('.tri--tl .tri-path')
    //   const pathTR = section.querySelector('.tri--tr .tri-path')
    //   const pathBL = section.querySelector('.tri--bl .tri-path')
    //   const pathBR = section.querySelector('.tri--br .tri-path')

    //   const getSvgFromPath = p => p?.closest('svg')
    //   const computeEndX = svg => {
    //     if (!svg) return 0.5
    //     const viewBox = svg.getAttribute('viewBox') || '0 0 1 459'
    //     const vbWidth = parseFloat(viewBox.split(' ')[2]) || 1
    //     const renderedWidth = svg.clientWidth || vbWidth
    //     const targetPx = Math.max(1, Math.round(window.innerWidth * 0.5))
    //     const ratio = targetPx / renderedWidth
    //     const endX = vbWidth * ratio
    //     return Math.max(1, endX)
    //   }

    //   const setEndTargets = () => {
    //     const endX_TL = computeEndX(getSvgFromPath(pathTL))
    //     const endX_TR = computeEndX(getSvgFromPath(pathTR))
    //     const endX_BL = computeEndX(getSvgFromPath(pathBL))
    //     const endX_BR = computeEndX(getSvgFromPath(pathBR))
    //     const h = 459
    //     const midY = h / 2
    //     pathTL && pathTL.setAttribute('data-d-end', `M0 0 L${endX_TL} ${midY} L0 ${h} V${midY} V0 Z`)
    //     pathTR && pathTR.setAttribute('data-d-end', `M0 0 L${endX_TR} ${midY} L0 ${h} V${midY} V0 Z`)
    //     pathBL && pathBL.setAttribute('data-d-end', `M0 0 L${endX_BL} ${midY} L0 ${h} V${midY} V0 Z`)
    //     pathBR && pathBR.setAttribute('data-d-end', `M0 0 L${endX_BR} ${midY} L0 ${h} V${midY} V0 Z`)
    //   }

    //   setEndTargets()

    //   const endTL = pathTL?.getAttribute('data-d-end')
    //   const endTR = pathTR?.getAttribute('data-d-end')
    //   const endBL = pathBL?.getAttribute('data-d-end')
    //   const endBR = pathBR?.getAttribute('data-d-end')

    //   if (pathTL && endTL) tlTriangles.to(pathTL, { attr: { d: endTL }, ease: 'none', duration: 1 }, 0)
    //   if (pathTR && endTR) tlTriangles.to(pathTR, { attr: { d: endTR }, ease: 'none', duration: 1 }, 0)
    //   if (pathBL && endBL) tlTriangles.to(pathBL, { attr: { d: endBL }, ease: 'none', duration: 1 }, 0)
    //   if (pathBR && endBR) tlTriangles.to(pathBR, { attr: { d: endBR }, ease: 'none', duration: 1 }, 0)

    //   window.addEventListener('resize', () => {
    //     setEndTargets()
    //     ScrollTrigger.refresh()
    //   })

    //   tlContent
    //     .fromTo(
    //       section.querySelector('.item__wrapper-info-title'),
    //       { y: 80, opacity: 0 },
    //       { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
    //     )
    //     .fromTo(
    //       section.querySelector('.item__wrapper-info-text'),
    //       { y: 80, opacity: 0 },
    //       { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
    //       '-=0.2'
    //     )
    //     .fromTo(
    //       section.querySelector('.item__wrapper-btn'),
    //       { y: 40, opacity: 0 },
    //       { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
    //       '-=0.2'
    //     )

    //   tl.add(tlTriangles, 0).add(tlContent, 0.3)
    //   window.addEventListener('load', () => ScrollTrigger.refresh())
    // }

    //v2
    // const section = document.querySelector('#one')
    // if (section) {
    //   const startPos = 'top top'
    //   ScrollTrigger.create({
    //     trigger: section,
    //     start: startPos,
    //     end: '+=80%',
    //     pin: true,
    //     pinSpacing: true,
    //     anticipatePin: 1
    //   })

    //   const triangles = Array.from(section.querySelectorAll('.triangle'))
    //   if (triangles.length) {
    //     const setInitial = () => {
    //       const w = window.innerWidth
    //       const offset = w * 0.5

    //       triangles.forEach((triangle, idx) => {
    //         if (idx === 0 || idx === 2) {
    //           gsap.set(triangle, { x: -offset, force3D: true })
    //         } else {
    //           gsap.set(triangle, { x: offset, force3D: true })
    //         }
    //       })
    //     }

    //     const tlTriangles = gsap.timeline()
    //     const tlContent = gsap.timeline()

    //     tlTriangles.to(triangles, {
    //       x: 0,
    //       ease: 'power2.out',
    //       duration: 0.6
    //     })

    //     tlContent
    //       .fromTo(
    //         section.querySelector('.item__wrapper-info-title'),
    //         { y: 80, opacity: 0 },
    //         { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' }
    //       )
    //       .fromTo(
    //         section.querySelector('.item__wrapper-info-text'),
    //         { y: 80, opacity: 0 },
    //         { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' },
    //         '-=0.2'
    //       )
    //       .fromTo(
    //         section.querySelector('.item__wrapper-btn'),
    //         { y: 40, opacity: 0 },
    //         { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' },
    //         '-=0.2'
    //       )

    //     gsap.timeline({
    //       scrollTrigger: {
    //         trigger: section,
    //         start: startPos,
    //         end: '+=80%',
    //         scrub: 0.3,
    //         onRefresh: setInitial
    //       }
    //     })
    //     .add(tlTriangles, 0)
    //     .add(tlContent, 0.3)

    //     setInitial()
    //   }
    // }
    
    //v3
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

        const tlTriangles = gsap.timeline({ paused: true })
        const tlContent = gsap.timeline({ paused: true })
        let isSectionActive = false

        const isMobile = window.innerWidth <= 768
        
        tlTriangles.to(triangles, {
          x: 0,
          ease: 'power2.out',
          duration: 0.6
        })

        tlContent
          .fromTo(
            section.querySelector('.item__wrapper-info-title'),
            { y: 80, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' }
          )
          .fromTo(
            section.querySelector('.item__wrapper-info-text'),
            { y: 80, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' },
            '-=0.2'
          )
          .fromTo(
            section.querySelector('.item__wrapper-btn'),
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' },
            '-=0.2'
          )
       
        ScrollTrigger.create({
          trigger: section,
          start: isMobile ? 'top 40%' : 'top 30%',
          end: isMobile ? 'bottom 20%' : 'bottom 10%',
          onToggle: self => {
            if (self.isActive && !isSectionActive) {
              if (tlTriangles.progress() === 0 && tlContent.progress() === 0) setInitial()
              tlTriangles.play(0)
              tlContent.play(0)
              isSectionActive = true
            } else if (!self.isActive && isSectionActive) {
              if (isMobile) {
                tlTriangles.reverse(0)
                tlContent.reverse(0)
              } else {
                tlTriangles.reverse()
                tlContent.reverse()
              }
              isSectionActive = false
            }
          },
          onRefresh: self => {
            if (!isSectionActive) setInitial()
          }
        })

        setInitial()
      }
    }

    //v1
    // const sectionTwo = document.querySelector('#two')
    // if (sectionTwo) {
    //   const circles = Array.from(sectionTwo.querySelectorAll('.two__circles .circle'))
    //   if (circles.length) {
    //     const endDistance = `+=${(circles.length || 3) * 50}%`
    //     ScrollTrigger.create({
    //       trigger: sectionTwo,
    //       start: 'top top',
    //       end: endDistance,
    //       pin: true,
    //       pinSpacing: true,
    //       anticipatePin: 1
    //     })

    //     const tlCircles = gsap.timeline({
    //       scrollTrigger: {
    //         trigger: sectionTwo,
    //         start: 'top top',
    //         end: endDistance,
    //         scrub: 1.2,
    //         invalidateOnRefresh: true
    //       }
    //     })
    //     const isMobileTwo = () => window.innerWidth < 930
    //     if (!isMobileTwo()) {
    //       if (circles[1]) gsap.set(circles[1], { autoAlpha: 0 })
    //       if (circles[2]) gsap.set(circles[2], { autoAlpha: 0 })
    //     }
    //     const computeFromRightX = (el) => {
    //       const rect = el.getBoundingClientRect()
    //       const offset = 60
    //       return (window.innerWidth - rect.left) + rect.width + offset
    //     }
    //     const computeFromCenterX = (el, idx) => {
    //       const rect = el.getBoundingClientRect()
    //       const container = sectionTwo.querySelector('.two__circles') || sectionTwo
    //       const crect = container.getBoundingClientRect()
    //       const elCenter = rect.left + rect.width / 2
    //       const cCenter = crect.left + crect.width / 2
    //       const base = cCenter - elCenter
    //       const quarter = rect.width * 0.25
    //       if (idx === 1) return base - quarter * 2
    //       if (idx === 2) return base - quarter * 2
    //       return base + quarter
    //     }
    //     if (isMobileTwo()) {
    //       const toValues = circles.map((el, idx) => {
    //         const rect = el.getBoundingClientRect()
    //         const quarter = rect.width * 0.5
    //         if (idx === 0) return -quarter
    //         if (idx === 1) return quarter
    //         return 0
    //       })
    //       const maxDist = Math.max(1, ...toValues.map(v => Math.abs(v)))
    //       circles.forEach((el, idx) => {
    //         const toX = toValues[idx]
    //         const dur = 0.8 + 0.8 * (Math.abs(toX) / maxDist)
    //         const pos = idx === 0 ? 0 : '<+0.08'
    //         tlCircles.to(el, { x: toX, ease: 'power3.out', duration: dur }, pos)
    //       })
    //     } else {
    //       const fromValues = circles.map((el, idx) => idx === 0 ? computeFromRightX(el) : computeFromCenterX(el, idx))
    //       const maxDist = Math.max(1, ...fromValues.map(v => Math.abs(v)))
    //       circles.forEach((el, idx) => {
    //         const fromX = fromValues[idx]
    //         const dur = 0.8 + 0.8 * (Math.abs(fromX) / maxDist)
    //         if (idx === 0) {
    //           tlCircles.fromTo(el, { x: fromX }, { x: 0, ease: 'power3.out', duration: dur })
    //         } else {
    //           tlCircles.fromTo(el, { x: fromX, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: 'power3.out', duration: dur })
    //         }
    //       })
    //     }
    //   }
    // }

    //v2
    // const sectionTwo = document.querySelector('#two')
    // if (sectionTwo) {
    //   const circles = Array.from(sectionTwo.querySelectorAll('.two__circles .circle'))
    //   if (circles.length) {
    //     const endDistance = `+=${circles.length * 50}%`
    //     const isMobile = () => window.innerWidth < 930

    //     if (isMobile()) {
    //       const tlCircles = gsap.timeline({
    //         scrollTrigger: {
    //           trigger: sectionTwo,
    //           start: 'top top',
    //           end: endDistance,
    //           scrub: 1.2,
    //           invalidateOnRefresh: true
    //         }
    //       })

    //       const toValues = circles.map((el, idx) => {
    //         const rect = el.getBoundingClientRect()
    //         const quarter = rect.width * 0.5
    //         if (idx === 0) return -quarter
    //         if (idx === 1) return quarter
    //         return 0
    //       })
    //       const maxDist = Math.max(1, ...toValues.map(v => Math.abs(v)))
    //       circles.forEach((el, idx) => {
    //         const toX = toValues[idx]
    //         const dur = 0.8 + 0.8 * (Math.abs(toX) / maxDist)
    //         const pos = idx === 0 ? 0 : '<+0.08'
    //         tlCircles.to(el, { x: toX, ease: 'power3.out', duration: dur }, pos)
    //       })
    //     } else {
    //       const setInitial = () => {
    //         const w = window.innerWidth
    //         const base = w + 300
    //         circles.forEach((circle, i) => {
    //           if (i === 0) {
    //             const offset50 = circle.getBoundingClientRect().width * 0.5
    //             gsap.set(circle, { x: offset50, opacity: 0, force3D: true })
    //           } else {
    //             gsap.set(circle, { x: base, force3D: true })
    //           }
    //         })
    //       }

    //       const tlCircles = gsap.timeline()
    //       const tlContent = gsap.timeline()

    //       tlCircles
    //         .to(circles[2], { x: 0, ease: 'power1.out', duration: 20 }, 0)
    //         .to(circles[1], { x: 0, ease: 'power1.out', duration: 20 }, 3.6)
    //         .to(circles[0], { x: 0, opacity: 1, ease: 'power1.out', duration: 20 }, 19)

    //       tlContent
    //         .fromTo(
    //           sectionTwo.querySelector('.item__wrapper-info-title'),
    //           { y: 80, opacity: 0 },
    //           { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
    //         )
    //         .fromTo(
    //           sectionTwo.querySelector('.item__wrapper-info-text'),
    //           { y: 80, opacity: 0 },
    //           { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
    //           '-=0.2'
    //         )
    //         .fromTo(
    //           sectionTwo.querySelector('.item__wrapper-btn'),
    //           { y: 40, opacity: 0 },
    //           { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
    //           '-=0.2'
    //         )

    //       gsap.timeline({
    //         scrollTrigger: {
    //           trigger: sectionTwo,
    //           start: 'top top',
    //           end: endDistance,
    //           scrub: 1,
    //           onRefresh: setInitial
    //         }
    //       })
    //       .add(tlCircles, 0)
          
    //       gsap.timeline({
    //         scrollTrigger: {
    //           trigger: sectionTwo,
    //           start: 'top top',
    //           end: '+=120%',
    //           scrub: 1
    //         }
    //       })
    //       .add(tlContent, 0)

    //       setInitial()
    //     }
    //   }
    // }

    //v3
    // const sectionTwo = document.querySelector('#two')
    // if (sectionTwo) {
    //   const circles = Array.from(sectionTwo.querySelectorAll('.two__circles .circle'))
    //   if (circles.length) {
    //     const endDistance = `+=${circles.length * 50}%`
    //     ScrollTrigger.create({
    //       trigger: sectionTwo,
    //       start: 'top top',
    //       end: endDistance,
    //       pin: true,
    //       pinSpacing: true,
    //       anticipatePin: 1
    //     })

    //     const isMobile = () => window.innerWidth < 930

    //     if (isMobile()) {
    //       const tlCircles = gsap.timeline({
    //         scrollTrigger: {
    //           trigger: sectionTwo,
    //           start: 'top top',
    //           end: endDistance,
    //           scrub: 1.2,
    //           invalidateOnRefresh: true
    //         }
    //       })

    //       const toValues = circles.map((el, idx) => {
    //         const rect = el.getBoundingClientRect()
    //         const quarter = rect.width * 0.5
    //         if (idx === 0) return -quarter
    //         if (idx === 1) return quarter
    //         return 0
    //       })
    //       const maxDist = Math.max(1, ...toValues.map(v => Math.abs(v)))
    //       circles.forEach((el, idx) => {
    //         const toX = toValues[idx]
    //         const dur = 0.8 + 0.8 * (Math.abs(toX) / maxDist)
    //         const pos = idx === 0 ? 0 : '<+0.08'
    //         tlCircles.to(el, { x: toX, ease: 'power3.out', duration: dur }, pos)
    //       })
    //     } else {
    //       const setInitial = () => {
    //         const w = window.innerWidth
    //         const base = w + 300
    //         circles.forEach((circle, i) => {
    //           if (i === 0) {
    //             const offset50 = circle.getBoundingClientRect().width * 0.5
    //             gsap.set(circle, { x: offset50, opacity: 0, force3D: true })
    //           } else {
    //             gsap.set(circle, { x: base, force3D: true })
    //           }
    //         })
    //       }

    //       const tlCircles = gsap.timeline()
    //       const tlContent = gsap.timeline()

    //       tlCircles
    //         .to(circles[2], { x: 0, ease: 'power1.out', duration: 20 }, 0)
    //         .to(circles[1], { x: 0, ease: 'power1.out', duration: 20 }, 3.6)
    //         .to(circles[0], { x: 0, opacity: 1, ease: 'power1.out', duration: 20 }, 19)

    //       tlContent
    //         .fromTo(
    //           sectionTwo.querySelector('.item__wrapper-info-title'),
    //           { y: 80, opacity: 0 },
    //           { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
    //         )
    //         .fromTo(
    //           sectionTwo.querySelector('.item__wrapper-info-text'),
    //           { y: 80, opacity: 0 },
    //           { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
    //           '-=0.2'
    //         )
    //         .fromTo(
    //           sectionTwo.querySelector('.item__wrapper-btn'),
    //           { y: 40, opacity: 0 },
    //           { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
    //           '-=0.2'
    //         )

    //       gsap.timeline({
    //         scrollTrigger: {
    //           trigger: sectionTwo,
    //           start: 'top top',
    //           end: endDistance,
    //           scrub: 1,
    //           onRefresh: setInitial
    //         }
    //       })
    //       .add(tlCircles, 0)
          
    //       gsap.timeline({
    //         scrollTrigger: {
    //           trigger: sectionTwo,
    //           start: 'top top',
    //           end: '+=120%',
    //           scrub: 1
    //         }
    //       })
    //       .add(tlContent, 0)

    //       setInitial()
    //     }
    //   }
    // }

    //v4
    const sectionTwo = document.querySelector('#two')
    if (sectionTwo) {
      const circles = Array.from(sectionTwo.querySelectorAll('.two__circles .circle'))
      if (circles.length) {
        const endDistance = `+=${circles.length * 50}%`
        ScrollTrigger.create({
          trigger: sectionTwo,
          start: 'top top',
          end: endDistance,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1
        })

        const isMobile = () => window.innerWidth < 930

        if (isMobile()) {
          const tlCircles = gsap.timeline({
            scrollTrigger: {
              trigger: sectionTwo,
              start: 'top top',
              end: endDistance,
              scrub: 1.2,
              invalidateOnRefresh: true
            }
          })

          const toValues = circles.map((el, idx) => {
            const rect = el.getBoundingClientRect()
            const quarter = rect.width * 0.5
            if (idx === 0) return -quarter
            if (idx === 1) return quarter
            return 0
          })
          const maxDist = Math.max(1, ...toValues.map(v => Math.abs(v)))
          circles.forEach((el, idx) => {
            const toX = toValues[idx]
            const dur = 0.8 + 0.8 * (Math.abs(toX) / maxDist)
            const pos = idx === 0 ? 0 : '<+0.08'
            tlCircles.to(el, { x: toX, ease: 'power3.out', duration: dur }, pos)
          })
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
              { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
            )
            .fromTo(
              sectionTwo.querySelector('.item__wrapper-info-text'),
              { y: 80, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
              '-=0.2'
            )
            .fromTo(
              sectionTwo.querySelector('.item__wrapper-btn'),
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
              '-=0.2'
            )

          gsap.timeline({
            scrollTrigger: {
              trigger: sectionTwo,
              start: 'top top',
              end: endDistance,
              scrub: 1,
              onRefresh: setInitial
            }
          })
          .add(tlCircles, 0)
          
          gsap.timeline({
            scrollTrigger: {
              trigger: sectionTwo,
              start: 'top top',
              end: '+=120%',
              scrub: 1
            }
          })
          .add(tlContent, 0)

          setInitial()
        }
      }
    }

    //v1
    // const sectionThree = document.querySelector('#three')
    // if (sectionThree) {
    //   const squaresForEnd = Array.from(sectionThree.querySelectorAll('.three__squares .square'))
    //   const endDistance = `+=${(squaresForEnd.length || 4) * 50}%`
    //   ScrollTrigger.create({
    //     trigger: sectionThree,
    //     start: 'top top',
    //     end: endDistance,
    //     pin: true,
    //     pinSpacing: true,
    //     anticipatePin: 1,
    //     pinType: 'transform'
    //   })

    //   const squares = Array.from(sectionThree.querySelectorAll('.three__squares .square'))
    //   if (squares.length) {
    //     const endDistanceTl = `+=${(squares.length || 4) * 50}%`
    //     const tlSquares = gsap.timeline({
    //       scrollTrigger: {
    //         trigger: sectionThree,
    //         start: 'top top',
    //         end: endDistanceTl,
    //         scrub: 1.2,
    //         invalidateOnRefresh: true
    //       }
    //     })

    //     const setInitial = () => {
    //       const w = window.innerWidth
    //       const h = window.innerHeight
    //       const base = w + 200
    //       squares.forEach((square, i) => {
    //         const yOffset = (i % 2) * (h * 0.3)
    //         gsap.set(square, { x: base, y: yOffset, opacity: 0 })
    //       })
    //     }

    //     setInitial()

    //     tlSquares
    //       .to(squares, {
    //         x: 0,
    //         y: 0,
    //         opacity: 1,
    //         stagger: 0.3,
    //         ease: 'power2.out',
    //         duration: 1
    //       })

    //     ScrollTrigger.addEventListener('refreshInit', setInitial)
    //     window.addEventListener('resize', () => ScrollTrigger.refresh())
    //   }
    // }

    //v2
    const sectionThree = document.querySelector('#three')
    if (sectionThree) {
      const squaresForEnd = Array.from(sectionThree.querySelectorAll('.three__squares .square'))
      const endDistance = `+=${squaresForEnd.length * 50}%`
      ScrollTrigger.create({
        trigger: sectionThree,
        start: 'top top',
        end: endDistance,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        pinType: 'transform'
      })

      const squares = Array.from(sectionThree.querySelectorAll('.three__squares .square'))
      if (squares.length) {
        const endDistanceTl = `+=${squares.length * 50}%`

        const tlSquares = gsap.timeline()
        const tlContent = gsap.timeline()

        const setInitial = () => {
          squares.forEach(square => {
            gsap.set(square, { opacity: 0 })
          })
        }

        tlSquares
          .to(squares, { opacity: 1, stagger: 0.3, ease: 'power2.out', duration: 1 })

        tlContent
          .fromTo(
            sectionThree.querySelector('.item__wrapper-info-title'),
            { y: 80, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
          )
          .fromTo(
            sectionThree.querySelector('.item__wrapper-info-text'),
            { y: 80, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
            '-=0.2'
          )
          .fromTo(
            sectionThree.querySelector('.item__wrapper-btn'),
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
            '-=0.2'
          )

        gsap.timeline({
          scrollTrigger: {
            trigger: sectionThree,
            start: 'top top',
            end: endDistanceTl,
            scrub: 1,
            onRefresh: setInitial
          }
        })
        .add(tlSquares, 0)
        .add(tlContent, 0.3)

        setInitial()
      }
    }

    //v1
    // const logosSections = document.querySelectorAll('.logos')
    // if (logosSections.length) {
    //   logosSections.forEach(section => {
    //     const rows = Array.from(section.querySelectorAll('.logos__wrapper-items-row'))
    //     if (!rows.length) return

    //     const clearAnims = () => {
    //       rows.forEach(row => {
    //         gsap.killTweensOf(row)
    //         row._st && row._st.kill()
    //         row._st = null
    //       })
    //     }

    //     const build = () => {
    //       rows.forEach((row, idx) => {
    //         const items = Array.from(row.children)
    //         if (!items.length) return

    //         const totalWidth = items.reduce((sum, item) => sum + item.offsetWidth, 0)
    //         const gap = parseFloat(getComputedStyle(row).gap) || 0
    //         const totalGaps = Math.max(0, items.length - 1) * gap
    //         const fullWidth = totalWidth + totalGaps

    //         const duration = Math.max(10, fullWidth / 50)
    //         const direction = idx % 2 === 0 ? -1 : 1

    //         gsap.set(row, { x: direction > 0 ? -fullWidth : 0 })
    //         row._st = gsap.to(row, {
    //           x: direction > 0 ? 0 : -fullWidth,
    //           duration: duration,
    //           ease: 'none',
    //           repeat: -1
    //         })
    //       })
    //     }

    //     const reset = () => {
    //       clearAnims()
    //       build()
    //     }

    //     build()
    //     ScrollTrigger.addEventListener('refreshInit', () => { clearAnims(); build(); reset() })
    //     window.addEventListener('resize', () => { clearAnims(); build(); reset(); ScrollTrigger.refresh() })
    //   })
    // }

    //v3
    const logosSections = document.querySelectorAll('.logos')
    if (logosSections.length) {
      logosSections.forEach(section => {
        const allRows = Array.from(section.querySelectorAll('.logos__wrapper-items-row'))
        if (!allRows.length) return

        const getVisibleRows = () => {
          const isMobile = window.innerWidth < 930
          return allRows.filter(row => {
            const isMobileRow = row.classList.contains('logos__wrapper-items-row--mobile')
            return isMobile ? true : !isMobileRow
          })
        }

        const initAnimation = () => {
          allRows.forEach(row => {
            gsap.killTweensOf(row)
          })

          const rows = getVisibleRows()

          rows.forEach((row, idx) => {
            const images = Array.from(row.querySelectorAll('img'))
            if (!images.length) return

            if (!row.dataset.cloned) {
              images.forEach(img => {
                const clone = img.cloneNode(true)
                row.appendChild(clone)
              })
              row.dataset.cloned = 'true'
            }
            if (!row.dataset.cloned2) {
              images.forEach(img => {
                const clone = img.cloneNode(true)
                row.appendChild(clone)
              })
              row.dataset.cloned2 = 'true'
            }

            const styles = getComputedStyle(row)
            const gapTokens = (styles.gap || styles.columnGap || '0').toString().trim().split(' ')
            const horizontalGap = parseFloat(gapTokens[0]) || 0
            const totalImagesWidth = images.reduce((width, img) => {
              const w = (img.getBoundingClientRect().width || img.offsetWidth || 150)
              return width + w
            }, 0)
            const totalGaps = Math.max(0, images.length - 1) * horizontalGap
            const singleSetWidth = Math.round(totalImagesWidth + totalGaps)

            gsap.set(row, { x: idx % 2 === 0 ? 0 : -singleSetWidth })

            gsap.to(row, {
              x: idx % 2 === 0 ? -singleSetWidth : 0,
              duration: 20,
              ease: 'none',
              repeat: -1,
              force3D: true,
              snap: { x: 1 },
              onUpdate: () => {
                const dirLeft = idx % 2 === 0
                const currentX = gsap.getProperty(row, 'x') || 0
                if (dirLeft && currentX <= -singleSetWidth) {
                  gsap.set(row, { x: currentX + singleSetWidth })
                } else if (!dirLeft && currentX >= 0) {
                  gsap.set(row, { x: currentX - singleSetWidth })
                }
              }
            })
          })
        }

        initAnimation()

        window.addEventListener('resize', () => {
          setTimeout(initAnimation, 100)
        })
      })
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

    // const casesSection = document.querySelector('.cases')
    // if (casesSection) {
    //   let timer = null
    //   let armed = true
    //   let lastAt = 0
    //   const stopScroll = () => {
    //     if (window.__lenis && window.__lenis.stop) window.__lenis.stop()
    //     else { document.documentElement.style.overflow = 'hidden'; document.body.style.overflow = 'hidden' }
    //   }
    //   const startScroll = () => {
    //     if (window.__lenis && window.__lenis.start) window.__lenis.start()
    //     else { document.documentElement.style.overflow = ''; document.body.style.overflow = '' }
    //   }
    //   const alignToTop = () => {
    //     if (window.__lenis && window.__lenis.scrollTo) {
    //       window.__lenis.scrollTo(casesSection, { offset: 0, immediate: true })
    //     } else {
    //       casesSection.scrollIntoView({ block: 'start' })
    //     }
    //   }
    //   const canRun = () => !timer && (Date.now() - lastAt > 600)
    //   const hold = () => {
    //     lastAt = Date.now()
    //     alignToTop()
    //     requestAnimationFrame(() => stopScroll())
    //     timer = setTimeout(() => { startScroll(); timer = null }, 5000)
    //   }
    //   ScrollTrigger.create({
    //     trigger: casesSection,
    //     start: 'top top',
    //     end: 'bottom top',
    //     onEnter: () => { if (armed && canRun()) { armed = false; hold() } },
    //     onLeaveBack: () => { if (armed && canRun()) { armed = false; hold() } },
    //     onLeave: () => { armed = true },
    //     onEnterBack: () => { armed = true },
    //     onKill: () => { if (timer) { clearTimeout(timer); timer = null; startScroll() } }
    //   })
    // }
  }
})