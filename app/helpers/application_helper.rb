module ApplicationHelper

  # used in layouts
  def ul_tree(ul_cssclass, links)
    result = "<ul class=\"#{ul_cssclass}\">"
    @topical_nav_links.each {|link|
      result += "<li>#{link_to link[:title], link[:url]}</li>"
      result += ul_tree(ul_cssclass, link[:sublinks]) if link[:sublinks]
    }
    result += '</ul>'
  end

end
