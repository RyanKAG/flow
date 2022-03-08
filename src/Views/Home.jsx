import React, { useEffect, useRef, useState } from 'react'
import { Network } from 'vis-network/standalone/esm/vis-network'
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
  const [UniqueNodes, setUniqueNodes] = useState([])

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
        gravitationalConstant: -40,
        centralGravity: 0.005,
        springLength: 230,
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
      selectionWidth: function (width) {
        return width * 2
      },
      font: {
        align: 'top',
        background: 'white',
      },
    },
    autoResize: true,
    height: '100%',
    width: '100%',
    clickToUse: false,
  }

  useEffect(() => {
    network.current = new Network(domNode.current, data, options)
    network.current.on('stabilizationIterationsDone, afterDrawing', function () {
      this.setOptions({ physics: false })
    })
    network.current.on('afterDrawing', function (ctx) {
      var dataURL = ctx.canvas.toDataURL()
      document.getElementById('canvasImg').href = dataURL
    })
  }, [domNode, network, data, options])

  const handleFileOne = (e) => {
    setFile1(e.target.files[0])
  }
  const handleFileTwo = (e) => {
    console.log(file1)
    console.log(e.target.files[0])
    // Implementation here
  }

  const handleFileUpload = async (e) => {
    const files = e.target.files
    var nodeSet = new Set()
    var n = []
    var n1 = []
    var e = []
    if (files) {
      Papa.parse(files[0], {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          console.log(results.data)
          results.data.forEach((row) => {
            nodeSet.add(row.FROM)
            nodeSet.add(row.TO)

            var edgeObj = {
              from: row.FROM,
              to: row.TO,
              arrows: 'to',
              label: row.REL,
              width: row.Weight,
              color: row.RELCOLOR,
            }
            e.push(edgeObj)
          })
          n = Array.from(nodeSet)
          n.forEach((node) => {
            var obj = {
              id: node,
              label: node,
              shape: 'box',
              color: '#29B0B0',
            }
            n1.push(obj)
          })

          setNodes(n1)
          setEdges(e)
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

          <div className="flex">
            <div>
              <InputFile label="1. Upload stakeholders file" re={inputRefOne} onChange={handleFileOne} />
            </div>

            <div>
              <InputFile label="2. Upload edge matrix file" re={inputRefTwo} onChange={handleFileUpload} />
            </div>
          </div>

          {nodes && nodes.length >= 1 && edges && edges.length >= 1 && <Button icon={<MdClear color="white" size={20} />} text="Reset" onClick={handleClear} />}
        </div>

        <div className="flex flex-col items-center h-full w-full">
          <div id="test" className="w-11/12 h-4/5 my-t-4 mb-1 border-2 border-dashed" ref={domNode} />
          <Button icon={<MdFileDownload color="white" size={20} />} text="Export" onClick={downloadNetworkAsImage} />
        </div>
      </div>

      <a id="canvasImg" download="filename"></a>
    </>
  )
}
export default Home
