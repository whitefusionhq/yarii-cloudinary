$:.push File.expand_path("lib", __dir__)

# Maintain your gem's version:
require "yarii-cloudinary/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |spec|
  spec.name        = "yarii-cloudinary"
  spec.version     = YariiCloudinary::VERSION
  spec.authors     = ["Jared White"]
  spec.email       = ["jared@jaredwhite.com"]
  spec.homepage    = "https://whitefusion.io"
  spec.summary     = "Allows images to be loaded and viewed in Yarii via the Cloudinary service"
  spec.description = spec.summary
  spec.license     = "MIT"

  spec.files = `git ls-files -z`.split("\x0").reject { |f| f.match(%r!^(test|script|spec|features)/!) }

  spec.add_dependency "rails", "~> 6.0.0"
  spec.add_dependency "webpacker", "~> 4.0"
  spec.add_dependency "cloudinary", "~> 1.12"
end
