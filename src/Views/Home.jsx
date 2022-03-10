import React, { useEffect, useRef, useState } from 'react'
import { Network } from 'vis-network/standalone/esm/vis-network'
import { DataSet } from 'vis-data'
import { MdFileDownload, MdClear, MdArrowForward } from 'react-icons/md'
import Papa from 'papaparse'
import TitleBar from '../components/TitleBar'
import isElectron from 'is-electron'
import whiteLogo from '../assets/images/whiteLogo.png'
import { BsDiagram2 } from 'react-icons/bs'
import Button from '../components/Button'
import InputFile from '../components/InputFile'
const Home = () => {
  // A reference to the div rendered by this component
  const domNode = useRef(null)
  const inputRefOne = useRef()
  const inputRefTwo = useRef()

  const [file1, setFile1] = useState(null)

  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])


  // A reference to the vis network instance
  const network = useRef(null)
  var ss = 'box'
  var ww = { id: 1, label: 'Node 1', shape: ss }

  const data = {
    nodes,
    edges,
  }

  const options = {
    physics: {
      forceAtlas2Based: {
        gravitationalConstant: -26,
        centralGravity: 0.0015,
        springLength: 200,
        springConstant: 0.035,
        avoidOverlap: 1,
      },
      maxVelocity: 146,
      solver: 'forceAtlas2Based',
      timestep: 0.35,
      stabilization: {
        enabled: true,
        iterations: 10000,
        updateInterval: 500,
        fit: true,
      },
    },
    nodes: {
      widthConstraint: { maximum: 200 },
    },

    edges: {
      physics: false,
      selectionWidth: function (width) {
        return width * 2
      },
      hoverWidth: function (width) {
        return width * 2
      },
      smooth: false,
      // smooth: {
      //   type: 'continuous',

      //   forceDirection: 'none'

      // },
      font: {
        align: 'top',
        background: 'white',
      },
    },
    // autoResize: true,
    interaction: { hover: true },
    height: '100%',
    width: '100%',
    clickToUse: false,
  }

  useEffect(() => {
    var nod = [
      { id: 1, label: 'Node 1', x: null, y: null },
      { id: 2, label: 'Node 2', x: null, y: null },
      { id: 3, label: 'Node 3', x: null, y: null },
      { id: 4, label: 'Node 4', x: null, y: null },
      { id: 5, label: 'Node 5', x: null, y: null }
    ];
    var edg = [
      { from: 1, to: 3 },
      { from: 1, to: 2 },
      { from: 2, to: 4 },
      { from: 2, to: 5 }
    ];
    network.current = network.current || new Network(domNode.current, { nodes: nod, edges: edg }, options)
    network.current.on('stabilizationIterationsDone', function () {
      this.setOptions({ physics: false })
    })
    console.log(network.current)

    network.current.on("click", function (n) {
      if (network.current) {
        const tempNodes = []
        nod.forEach(e => {
          const position = network.current.getPositions([e.id])
          const posX = position[`${e.id}`].x
          const posY = position[`${e.id}`].y
          tempNodes.push({
            id: e.id,
            label: e.label,
            x: posX,
            y: posY
          })
        })
        nod = tempNodes
        //setNodes
      }
      console.log(nod)
    })


    network.current.on('afterDrawing', function (ctx) {
      // this.setOptions({ physics: false })
      var dataURL = ctx.canvas.toDataURL()
      document.getElementById('canvasImg').href = dataURL
    })

  }, [domNode, network, nodes, options])

  const handleFileOne = (e) => {
    setFile1(e.target.files[0])
  }
  const handleFileTwo = (e) => {
    console.log(file1)
    console.log(e.target.files[0])
    // Implementation here
  }

  const handleFileUpload = async (edges) => {
    const files = edges.target.files
    var nodeSet = new DataSet()
    var edges = new DataSet()
    if (files) {
      Papa.parse(files[0], {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          console.log(results.data)
          let id = 0
          results.data.forEach((row) => {
            const sourceNode = {
              id: id,
              text: row.FROM,
            }
            id++
            nodeSet.add(sourceNode)
            const destNode = {
              id: id,
              text: row.FROM,
            }
            id++
            nodeSet.add(destNode)

            var edgeObj = {
              from: row.FROM,
              to: row.TO,
              arrows: 'to',
              label: row.REL,
              width: row.Weight,
              color: row.RELCOLOR,
            }
            edges.add(edgeObj)
          })


          setNodes(nodeSet)
          setEdges(edges)
        },
      })
    }
  }

  const handleClear = () => {
    inputRefOne.current.value = ''
    inputRefTwo.current.value = ''
    setEdges([])
    setNodes([])
  }

  function scrollTo() {
    const divElement = document.getElementById('test')
    divElement.scrollIntoView({ behavior: 'smooth' })
  }

  const downloadNetworkAsImage = () => {
    document.getElementById('canvasImg').click()
  }

  return (
    <>
      {isElectron() && <TitleBar />}

      <div className="flex flex-col justify-center h-screen bg-gray-100">
        <div className="overflow-y-hidden ">
          <div className="mx-auto container py-12 px-4 ">
            <div className="w-full flex justify-center">
              <div className="w-full md:w-11/12 xl:w-10/12 bg-primary md:py-8 md:px-8 px-5 py-4 xl:px-12 xl:py-16 shadow-md">
                <div>
                  <div className="flex flex-wrap items-center md:flex-row flex-col-reverse">
                    <div className="md:w-2/3 w-full pb-6 md:pb-0 md:pr-6 flex-col md:block flex items-center justify-center md:pt-0 pt-4">
                      <div>
                        <h1 className="text-xl md:text-2xl lg:text-4xl xl:text-4xl lg:w-10/12 text-white font-black leading-6 lg:leading-10 md:text-left text-center">
                          Stakeholder Diagram
                        </h1>
                        <p className="text-lg md:text-base xl:text-xl font-light text-gray-200 xl:leading-normal pt-2">
                          You can upload your files (.csv,.xlsx,.xls) to generate the diagram
                        </p>
                      </div>
                      <button
                        onClick={scrollTo}
                        className="mt-5 lg:mt-8 py-3 lg:py-4 px-4 lg:px-8 bg-white font-bold text-black text-sm lg:text-lg xl:text-xl hover:bg-opacity-90  focus:ring-2 focus:ring-offset-2 focus:ring-white focus:outline-none"
                      >
                        Get started
                      </button>
                    </div>
                    <div className="md:w-1/3 w-2/3">
                      <img className="" src={whiteLogo} alt="image" />
                      {/* <img className="rounded-lg opacity-40" src={Wallpaper} alt="image" /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-around h-screen">
        <div className="flex-col">
          <div className="mt-4 mb-2">
            <h1 className="text-xl md:text-2xl lg:text-4xl xl:text-4xl lg:w-full text-primary font-black leading-6 lg:leading-10 md:text-left text-center">
              Upload your files
            </h1>
            <p className="text-lg md:text-base xl:text-xl font-light text-gray-800 xl:leading-normal pt-1">You can only upload (.csv,.xlsx,.xls) files</p>
          </div>

          <div className="flex items-center gap-2">
            <div>
              <InputFile label="1. Upload stakeholders file" re={inputRefOne} onChange={handleFileOne} />
            </div>

            <div>
              <InputFile label="2. Upload edge matrix file" re={inputRefTwo} onChange={handleFileUpload} />
            </div>
          </div>

          {nodes && nodes.length >= 1 && edges && edges.length >= 1 && <Button icon={<MdClear color="white" size={20} />} text="Reset" onClick={handleClear} />}
        </div>

        <div className="flex flex-col items-center h-full w-full mt-4">
          <div id="test" className="w-11/12 h-5/6 my-t-4 mb-1 border-2 border-dashed" ref={domNode} />
          <Button icon={<MdFileDownload color="white" size={20} />} text="Export" onClick={downloadNetworkAsImage} />
        </div>
      </div>

      <a id="canvasImg" download="filename"></a>
    </>
  )
}
export default Home
