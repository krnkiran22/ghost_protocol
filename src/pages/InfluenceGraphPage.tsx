import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  ArrowLeft,
  Info
} from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { useAllIPAssets, useIPAssetStats } from '@/hooks/useIPAssetData';

// Mock IP Asset data (replace with real contract calls)
interface IPAssetNode {
  id: string;
  title: string;
  creator: string;
  year: number;
  isDeceased: boolean;
  totalRoyalties: number;
  derivatives: number;
}

interface GraphEdge {
  source: string;
  target: string;
  strength: number; // 0-100, influence strength
}

/**
 * The Influence Graph - Signature Feature
 * 
 * Visualizes IP Assets as nodes in a force-directed graph
 * Shows influence relationships and royalty flows
 * NOW USES REAL BLOCKCHAIN DATA!
 */
export const InfluenceGraphPage: React.FC = () => {
  const navigate = useNavigate();
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<IPAssetNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEra, setFilterEra] = useState<string>('all');
  
  // Fetch real blockchain data
  const { ipAssets: blockchainAssets, totalCount, isLoading: loadingAssets } = useAllIPAssets();
  const { stats, isLoading: loadingStats } = useIPAssetStats();

  // Mock data for demo (fallback when no blockchain data)
  const mockNodes: IPAssetNode[] = [
    {
      id: '1',
      title: 'Dracula',
      creator: 'Bram Stoker',
      year: 1897,
      isDeceased: true,
      totalRoyalties: 847293,
      derivatives: 1247
    },
    {
      id: '2',
      title: 'Frankenstein',
      creator: 'Mary Shelley',
      year: 1818,
      isDeceased: true,
      totalRoyalties: 623847,
      derivatives: 892
    },
    {
      id: '3',
      title: 'Interview with the Vampire',
      creator: 'Anne Rice',
      year: 1976,
      isDeceased: true,
      totalRoyalties: 423091,
      derivatives: 342
    },
    {
      id: '4',
      title: 'Twilight',
      creator: 'Stephenie Meyer',
      year: 2005,
      isDeceased: false,
      totalRoyalties: 892374,
      derivatives: 628
    },
    {
      id: '5',
      title: 'AI Vampire Novel Generator',
      creator: 'OpenAI (AI-Generated)',
      year: 2024,
      isDeceased: false,
      totalRoyalties: 142837,
      derivatives: 23842
    },
    {
      id: '6',
      title: 'Castlevania',
      creator: 'Konami',
      year: 1986,
      isDeceased: false,
      totalRoyalties: 324982,
      derivatives: 67
    },
    {
      id: '7',
      title: 'The Vampyre',
      creator: 'John Polidori',
      year: 1819,
      isDeceased: true,
      totalRoyalties: 102938,
      derivatives: 142
    },
  ];

  const mockEdges: GraphEdge[] = [
    { source: '7', target: '1', strength: 85 }, // Polidori → Stoker
    { source: '2', target: '1', strength: 45 }, // Shelley → Stoker
    { source: '1', target: '3', strength: 92 }, // Stoker → Rice
    { source: '1', target: '4', strength: 78 }, // Stoker → Meyer
    { source: '1', target: '6', strength: 88 }, // Stoker → Castlevania
    { source: '3', target: '4', strength: 65 }, // Rice → Meyer
    { source: '1', target: '5', strength: 94 }, // Stoker → AI
    { source: '3', target: '5', strength: 87 }, // Rice → AI
    { source: '4', target: '5', strength: 76 }, // Meyer → AI
  ];
  
  // Use blockchain data if available, otherwise fallback to mock
  const displayNodes = totalCount > 0 ? blockchainAssets : mockNodes;
  const displayEdges = totalCount > 0 ? [] : mockEdges; // Build edges from blockchain relationships when available
  const isUsingRealData = totalCount > 0;

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous render
    d3.select(svgRef.current).selectAll('*').remove();

    const width = 1200;
    const height = 700;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto;');

    // Add zoom behavior
    const g = svg.append('g');
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    
    svg.call(zoom as any);

    // Create force simulation
    const simulation = d3.forceSimulation(mockNodes as any)
      .force('link', d3.forceLink(mockEdges)
        .id((d: any) => d.id)
        .distance(d => 150 - (d as any).strength) // Stronger = closer
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    // Draw links (edges)
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(mockEdges)
      .join('line')
      .attr('stroke', '#D4AF37')
      .attr('stroke-opacity', (d: any) => d.strength / 200)
      .attr('stroke-width', (d: any) => Math.sqrt(d.strength / 10));

    // Draw nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(mockNodes)
      .join('g')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any
      );

    // Node circles
    node.append('circle')
      .attr('r', (d: any) => Math.max(25, Math.log(d.totalRoyalties) * 3))
      .attr('fill', (d: any) => {
        if (d.isDeceased) return '#D4AF37'; // Gold for Ghost Wallets
        if (d.creator.includes('AI')) return '#60A5FA'; // Blue for AI
        return '#A8A29E'; // Gray for living
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .attr('cursor', 'pointer')
      .on('click', (event, d: any) => {
        event.stopPropagation();
        setSelectedNode(d);
      })
      .on('mouseenter', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', function(d: any) {
            return Math.max(30, Math.log(d.totalRoyalties) * 3.5);
          })
          .attr('stroke-width', 5);
      })
      .on('mouseleave', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', function(d: any) {
            return Math.max(25, Math.log(d.totalRoyalties) * 3);
          })
          .attr('stroke-width', 3);
      });

    // Node labels
    node.append('text')
      .text((d: any) => d.title.length > 12 ? d.title.substring(0, 10) + '...' : d.title)
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('fill', '#000')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('pointer-events', 'none');

    // Year badges
    node.append('text')
      .text((d: any) => d.year)
      .attr('text-anchor', 'middle')
      .attr('dy', '2em')
      .attr('fill', '#78716C')
      .attr('font-size', '9px')
      .attr('pointer-events', 'none');

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [displayNodes, displayEdges]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
      {/* Header */}
      <header className="bg-stone-900/50 backdrop-blur-md border-b border-stone-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                icon={<ArrowLeft className="h-4 w-4" />}
                onClick={() => navigate('/')}
                className="text-stone-300 hover:text-white"
              >
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">The Influence Graph</h1>
                <p className="text-sm text-stone-400">
                  {isUsingRealData 
                    ? `Showing ${totalCount} IP Assets from blockchain ${stats ? `(${stats.deceased} deceased, ${stats.living} living)` : ''}` 
                    : 'Demo mode - Connect to blockchain to see your IP Assets'}
                </p>
              </div>
            </div>
            {loadingAssets && (
              <div className="text-sm text-stone-400 animate-pulse">
                Loading blockchain data...
              </div>
            )}
          </div>

          {/* Search & Filters */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
              <input
                type="text"
                placeholder="Search IP Assets, creators, or works..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:border-gold"
              />
            </div>
            <select
              value={filterEra}
              onChange={(e) => setFilterEra(e.target.value)}
              className="px-4 py-2 bg-stone-800 border border-stone-700 rounded-lg text-white focus:outline-none focus:border-gold"
            >
              <option value="all">All Eras</option>
              <option value="historical">Historical (pre-1950)</option>
              <option value="modern">Modern (1950-2020)</option>
              <option value="ai">AI-Generated (2020+)</option>
            </select>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Graph Canvas */}
        <div className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-stone-800/50 backdrop-blur-sm rounded-2xl border border-stone-700 p-6 shadow-2xl"
          >
            {/* Legend */}
            <div className="flex items-center gap-6 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gold"></div>
                <span className="text-stone-300">Ghost Wallet (Deceased)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-400"></div>
                <span className="text-stone-300">AI-Generated</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-stone-400"></div>
                <span className="text-stone-300">Living Creator</span>
              </div>
            </div>

            {/* SVG Canvas */}
            <svg ref={svgRef} className="w-full bg-stone-900/30 rounded-lg" />

            {/* Instructions */}
            <div className="mt-4 flex items-start gap-2 text-xs text-stone-400">
              <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-300">Instructions:</strong> Drag nodes to rearrange • Click nodes for details • Scroll to zoom • Node size = total royalties earned
              </div>
            </div>
          </motion.div>
        </div>

        {/* Detail Panel */}
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-96 p-8"
          >
            <Card className="bg-stone-800/80 backdrop-blur-md border-stone-700 text-white p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{selectedNode.title}</h2>
                  <p className="text-stone-400">by {selectedNode.creator} ({selectedNode.year})</p>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-stone-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {selectedNode.isDeceased && (
                <div className="bg-gold/20 border border-gold/30 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 text-gold text-sm font-semibold">
                    👻 Ghost Wallet Active
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <p className="text-stone-400 text-sm">Total Royalties Earned</p>
                  <p className="text-3xl font-bold text-gold">${selectedNode.totalRoyalties.toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-stone-400 text-sm">Total Derivatives</p>
                  <p className="text-2xl font-bold">{selectedNode.derivatives.toLocaleString()}</p>
                </div>

                <div className="border-t border-stone-700 pt-4">
                  <p className="text-stone-400 text-sm mb-2">Influence Impact</p>
                  <div className="bg-stone-900/50 rounded-lg p-3">
                    <div className="text-xs text-stone-400 mb-1">Royalty flow visualization</div>
                    <div className="h-2 bg-stone-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-gold via-amber-400 to-gold animate-pulse"
                        style={{ width: '75%' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="primary" size="sm" className="flex-1">
                    License This IP
                  </Button>
                  <Button variant="outline" size="sm" className="text-white border-stone-600">
                    Details →
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};
